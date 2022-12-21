import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { GoogleAuthProvider, signInWithCredential } from '@firebase/auth';
import { auth } from '$lib/services/firebase/client';
import { sessionKey } from '$lib/services/firebase/session';
import get from 'lodash/get';
import mapKeys from 'lodash/mapKeys';
import camelCase from 'lodash/camelCase';
import merge from 'lodash/merge';
import {
	getUserTokensByIdToken,
	setUserTokensToDatabase,
	invalidateUserTokensInMemory
} from '$lib/services/firebase/database';

type AuthBody = {
	firebase: any,
	google: any,
	updatedAt: number
};

async function getResponseWithDatabase(body:AuthBody) {
	await setUserTokensToDatabase(body);
	invalidateUserTokensInMemory(body.firebase?.localId);
	const headers = new Headers();
	headers.append('Cache-Control', 'no-store');
	return new Response(
		JSON.stringify({
			expiresIn: body.firebase?.oauthExpireIn,
			idToken: body.firebase?.idToken,
			accessToken: body.google?.accessToken,
			user: {
				userId: body.firebase?.localId,
			}
		}), { headers }
	);
}

function requestOAuth2Tokens(additions = {}) {
	return fetch('https://www.googleapis.com/oauth2/v4/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Cache-Control': 'no-store'
		},
		body: JSON.stringify({
			client_id: String(import.meta.env.google_clientid),
			client_secret: String(import.meta.env.google_clientsecret),
			...additions
		})
	})
		.catch(error => {
			console.log(error);
			return Promise.reject({
				status: 404,
				statusText: error.message
			});
		})
		.then(res => {
			if (!res.ok) return Promise.reject({
				status: res.status,
				statusText: res.statusText
			});
			return res.json();
		})
		.then(async res => {
			const credential = GoogleAuthProvider.credential(res.id_token, res.access_token);
			const tokens = await signInWithCredential(auth, credential).catch(error => {
				console.warn(error.code, error.message);
				return null;
			});
			if(!tokens) Promise.reject({
				status: 500,
				statusText: 'SignIn credential Error'
			});
			return {
				status: 200,
				statusText: 'Succeed',
				body: {
					google: mapKeys(res, (_, k) => camelCase(k)),
					firebase: get(tokens, '_tokenResponse'),
					updatedAt: new Date().getTime(),
				}
			};
		})
		.catch(e => {
			console.error(e);
			return e;
		});
}

export const GET: RequestHandler = async ({ cookies }) => {
	if(!cookies.get(sessionKey)) {
		throw error(401, 'Unauthorized');
	}
	const idToken = cookies.get(sessionKey);
	const values = await getUserTokensByIdToken(idToken);
	if(!values?.google || !values?.firebase) {
		throw error(400, 'Bad request');
	}
	const headers = new Headers();
	headers.append('Cache-Control', 'no-store');
	return new Response(
		JSON.stringify({
			idToken: values.firebase.idToken,
			accessToken: values.google.accessToken
		}), { headers }
	);
};

export const POST: RequestHandler = async ({ request }) => {
	const { code } = await request.json();
	const result = await requestOAuth2Tokens({
		'grant_type': 'authorization_code',
		'code': code,
		'redirect_uri': String(import.meta.env.google_redirect_endpoint || '')
	});
	if(result?.status !== 200) {
		throw error(result?.status, result?.statusText);
	}
	return await getResponseWithDatabase(result?.body);
}

export const PUT: RequestHandler = async ({ cookies }) => {
	if(!cookies.get(sessionKey)) {
		throw error(400, 'Bad Request');
	}
	const idToken = cookies.get(sessionKey);
	const currentValues = await getUserTokensByIdToken(idToken);
	const result = await requestOAuth2Tokens({
		'grant_type': 'refresh_token',
		'access_type': 'offline',
		'refresh_token': currentValues?.google.refreshToken
	});
	if(result?.status !== 200) {
		throw error(result?.status, result?.statusText);
	}
	return await getResponseWithDatabase(merge(currentValues, result?.body));
}
