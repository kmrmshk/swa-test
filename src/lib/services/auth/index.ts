import { base } from '$app/paths';
import { browser, dev } from '$app/environment';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { writable, derived, get } from 'svelte/store';
import { notify } from '$lib/functions/util';
import type { AuthorizationCode } from './types';
import { throttle } from 'lodash';
import Axios from 'axios';
import * as workerTimer from 'worker-timers';
import { tab } from '$lib/functions/network';
import { UsersApi } from '$lib/apis';

/**
 * 認証したユーザ情報
 * 認証に関する情報、処理は auth モジュールに寄せる
 * userストアは認証に関係しないコンテンツ依存の情報を格納するよう棲み分けている
 */
export const authUser = writable(null);
/**
  * 認証情報の検証中かどうか
  */
export const verifying = writable<boolean>(true);
/**
  * Google/Firebaseの認証情報を取得した状態かどうか
  */
export const authorized = derived(authUser, u => !isEmpty(u));

const keyExpiresIn = 'fi-auth-expiresIn';
const tokenPath = `${ base }/api/auth/token`;
const sessionPath = `${ base }/api/auth/session`;
const checkInterval = 60000;

let checkingIntervalId: any;

/**
 * Google認証画面をポップアップウィンドウで表示
 */
function popupAuthorizationCode() {
	const googleAuthBaseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
	const popupWidth = 512;
	const popupHeight = 720;
	const windowParams = map({
		screenX: window.screenX + (window.outerWidth / 2) - (popupWidth / 2),
		screenY: window.screenY + (window.outerHeight / 2) - (popupHeight / 2),
		width: popupWidth,
		height: popupHeight
	}, (v, k) => `${ k }=${ v }`).join(',');

	const params = new URLSearchParams();
	params.append('response_type','code');
	params.append('client_id', String(import.meta.env.google_clientid));
	params.append('scope', String(import.meta.env.google_authscope || ''));
	params.append('redirect_uri', String(import.meta.env.google_redirect_endpoint));
	params.append('prompt','select_account consent');
	params.append('access_type','offline');

	return window.open(`${googleAuthBaseUrl}?${params.toString()}`, 'Authorization', windowParams);
};

export function setHeaders(tokens:any) {
	Axios.defaults.headers.common['Authorization'] = `Bearer ${ tokens?.idToken }`;
	Axios.defaults.headers.common['X-YouTube-AccessToken'] = tokens?.accessToken;
}

export function unsetHeaders() {
	delete Axios.defaults.headers.common['Authorization'];
	delete Axios.defaults.headers.common['X-YouTube-AccessToken'];
}

async function validate () {
	const result = await getAuthTokens();
	setHeaders(result);
	dev && console.log('Tokens verified');
}

/**
 * トークンリフレッシュ判定の定期処理をセット
 */
function startCheckingExpire() {
	if(!browser) return;
	// NOTE: 非アクティブ→アクティブへ切り替わった時のスタック分を考慮
	const handler = throttle(async () => {
		dev && console.log('remainingTime ?', getTimeRemaining());
		if(getTimeRemaining() < 1) {
			verifying.set(true);
			const result = await refreshToken();
			if(!result) {
				await signOut();
				stopCheckingExpire();
			}
			verifying.set(false);
		}
	}, 5000, {
		leading: true,
		trailing: false
	});
	stopCheckingExpire();
	checkingIntervalId = workerTimer.setInterval(handler, checkInterval);
}

/**
 * トークンのリフレッシュ判定の定期処理を止める
 */
function stopCheckingExpire() {
	if(!browser || !checkingIntervalId) return;
	workerTimer.clearInterval(checkingIntervalId);
	checkingIntervalId = null;
}

/**
 * トークンリフレッシュを行うまでの残り時間を算出する
 */
function getTimeRemaining() {
	const offsetTime = 300000; // 5[min]
	let value, expiresIn = 0;
	try {
		value = localStorage.getItem(keyExpiresIn);
	} catch (e) {
		value = null;
	}
	expiresIn = parseInt(value ?? '0');
	return expiresIn - new Date().getTime() - offsetTime;
}

/**
 * 認証処理の初期化
 * - 認証状態の購読
 * - 期限切れの場合はリフレッシュトークンにより再取得を試行
 */
export async function initializeAuth() {
	const check = async () => {
		verifying.set(true);
		let result = get(authorized);
		if (!result) {
			verifying.set(false);
			return false;
		}
		if (getTimeRemaining() <= 0) {
			dev && console.log('Attempt refresh');
			result = await refreshToken();
		}
		await validate();
		verifying.set(false);
		return !!result;
	};

	tab?.on('refreshed', ({ data, from }) => {
		if(tab?.id === from) {
			return;
		}
		authUser.set(data?.user);
		if (data?.user) {
			validate();
			startCheckingExpire();
		} else {
			stopCheckingExpire();
		}
	});

	if(await check()) {
		startCheckingExpire();
	}
}

/**
 * トークンの更新
 */
export async function refreshToken() {
	verifying.set(true);
	return fetch(tokenPath, {
		method: 'PUT',
		cache: 'no-store'
	})
		.then(res => {
			if (!res.ok) return Promise.reject(res);
			return res.json();
		})
		.then((data) => {
			const time = new Date().getTime() + (data?.expiresIn * 1000);
			localStorage.setItem(keyExpiresIn, `${ time }`);
			authUser.set(data?.user);
			setHeaders(data);
			return fetch(sessionPath, {
				method: 'POST',
				body: JSON.stringify(data),
				cache: 'no-store'
			});
		})
		.then(res => {
			if (!res.ok) return Promise.reject(res);
			tab?.postMessage('refreshed', { user: get(authUser) });
			return res.json();
		})
		.catch(err => {
			console.warn(err);
			return false;
		})
		.finally(() => {
			verifying.set(false);
		});
}

/**
 * サインイン
 */
export async function signIn() {
	if(!browser) {
		throw Error('Attempted to sign-in without browser');
	}
	verifying.set(true);
	return new Promise<AuthorizationCode>((resolve, reject) => {
		const target = popupAuthorizationCode();
		const onMessage = ({ data }) => {
			if(data.type === 'google-api-authorization-code') {
				result = data;
			}
		};
		let result = null;
		let intervalId = window.setInterval(() => {
			if(!target.closed) {
				return;
			}
			window.removeEventListener('message', onMessage);
			window.clearInterval(intervalId);
			if(result) {
				resolve(result);
			} else {
				reject(false);
			}
		}, 500);
		window.addEventListener('message', onMessage);
	})
		.then(({ code }) => fetch(tokenPath, {
			method: 'POST',
			body: JSON.stringify({ code }),
			cache: 'no-store'
		}))
		.then(res => {
			if (!res.ok) return Promise.reject(res);
			return res.json();
		})
		.then(data => {
			setHeaders(data);
			return UsersApi
				.postApiV1UsersCreate({
					xYouTubeAccessToken: data?.accessToken
				})
				.then(succeed => {
					if(succeed) {
						return data;
					}
					return Promise.reject('Failed user create');
				});
		})
		.then(data => {
			const time = new Date().getTime() + (data?.expiresIn * 1000);
			localStorage.setItem(keyExpiresIn, `${ time }`);
			authUser.set(data?.user);
			setHeaders(data);
			return fetch(sessionPath, {
				method: 'POST',
				body: JSON.stringify(data),
				cache: 'no-store'
			});
		})
		.then(res => {
			if (!res.ok) {
				return Promise.reject(res);
			}
			startCheckingExpire();
			tab?.postMessage('refreshed', { user: get(authUser) });
			return res.json();
		})
		.catch(err => {
			unsetHeaders();
			if(err?.name !== 'ApiError') {
				notify('ログインに失敗しました。恐れ入りますがYouTubeのアカウントをご確認ください。');
			}
			return false;
		})
		.finally(() => {
			verifying.set(false);
		});
}

/**
 * サインアウト
 */
export async function signOut() {
	verifying.set(true);
	stopCheckingExpire();
	return await fetch(sessionPath, { method: 'DELETE' })
		.then(_ => {
			authUser.set(null);
			localStorage.removeItem(keyExpiresIn);
			tab?.postMessage('refreshed', { user: null });
			unsetHeaders();
			return true;
		})
		.catch(err => {
			console.warn(err);
			return false;
		})
		.finally(() => {
			verifying.set(false);
		});
}

/**
 * 認証トークン取得
 */
export function getAuthTokens() {
	return fetch(`${ base }/api/auth/token`, {
		method: 'GET',
		cache: 'no-store'
	})
		.then(res => {
			if(!res.ok) {
				return Promise.reject(res);
			}
			return res.json();
		})
		.catch(err => {
			console.log(err);
			return null;
		});
}