import get from 'lodash/get';
import map from 'lodash/map';
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const trigger = (eventName: string, params = {}) => {
	if (browser) {
		window.dispatchEvent(new CustomEvent(eventName, { detail: params }));
	}
};

export const notify = (message: string = '', time: number = 10000, options:object = {}) => {
	if (browser) {
		window.dispatchEvent(new CustomEvent('notice', {
			detail: {
				message,
				time,
				options
			},
		}));
	}
};

export const sleep = (milliseconds: number) => {
	return new Promise((res) => {
		setTimeout(res, milliseconds);
	});
};

export const encodeURI = (str: string) => {
	return encodeURIComponent(str);
}

export const decodeURI = (str: string) => {
	return decodeURIComponent(str);
}

export const copyToClipboard = (str: string) => {
	if (navigator.clipboard) {
		return navigator.clipboard.writeText(str);
	}
	return new Promise((resolve, reject) => {
		const event = 'copy';
		const onCopy = (e:ClipboardEvent) => {
			let { clipboardData } = e;
			e.preventDefault();
			document.removeEventListener(event, onCopy);
			if(!!clipboardData) {
				clipboardData.setData('text/plain', str);
				resolve(void 0);
			} else {
				reject(void 0);
			}
		};
		document.addEventListener(event, onCopy);
		document.execCommand(event);
	});
};

export const openPopup = (path: string, options = {}, windowName = '') => {
	const defaultWidth = 1280;
	const defaultHeight = 720;
	const calcWindowSize = ({ width = defaultWidth, height = defaultHeight }) => {
		const availW = window.screen.availWidth;
		const availH = window.screen.availHeight;
		let w;
		let h;
		h = Math.min(availW, width) * height / width;
		w = h * width / height;
		if (availH < h) {
			w = availH * width / height;
			h = w * height / width;
		}
		return { width: w, height: h };
	};
	const getFeatures = (params = {}) => {
		const w = get(params, 'width', defaultWidth);
		const h = get(params, 'height', defaultHeight);
		return {
			screenX: (window.screenLeft || 0) + (window.outerWidth - w) / 2,
			screenY: (window.screenTop || 0) + (window.outerHeight - h) / 2,
			width: w,
			height: h,
			menubar: get(params, 'menubar', 0),
			toolbar: get(params, 'toolbar', 0),
			location: get(params, 'location', 0),
			status: get(params, 'status', 0),
			resizable: get(params, 'resizable', 1),
			scrollbars: get(params, 'scrollbars', 1),
		};
	};
	const optionStr = map(getFeatures(calcWindowSize(options)), (v, k) => `${ k }=${ v }`).join(',');
	return window.open(path, windowName, optionStr);
};

const mbPattern = /[\x01-\x7E\uFF65-\uFF9F]/;

export const strTrim = (strings = '', trimNum = 1) => {
	const length = strings.length;
	let count = 0;
	let text = '';
	for(let i = 0; i < length; ++i) {
		count += strings[i].match(mbPattern) ? 1 : 2;
		if(count < trimNum) {
			text += strings[i];
			continue;
		}
		break;
	}
	return text;
}

export const strLength = (strings = '') => {
	const length = strings.length;
	let count = 0;
	for(let i = 0; i < length; ++i) {
		count += strings[i].match(mbPattern) ? 1 : 2;
	}
	return count;
};

export const clipText = (text: string, bytes: number, index = 0, suffix = '') => {
	const arr = text.split('');
	let count = 0
	let clippedText = '';
	for(let i = index; i < arr.length; ++i) {
		let t = escape(arr[i]);
		count += (t.length < 4) ? 1 : 2;
		if(count > bytes) {
			return clippedText + suffix;
		}
		clippedText += text.charAt(i);
	}
	return clippedText;
}

export function persistent<T>(key:string, conv:(value:string | null) => T) {
	const { subscribe, set } = writable<T | null>();
	const fetch = () => {
		browser && set(conv(localStorage.getItem(key)));
	};
	fetch();
	return {
		subscribe,
		fetch,
		set: (value: T | null) => {
			set(value);
			browser && localStorage.setItem(key, `${ value }`);
		},
		clear: () => {
			set(null);
			browser && localStorage.removeItem(key);
		}
	};
}

export const parseTextLink = (str: string, convertingUrl: boolean = true, convertingHashtag: boolean = false, convertingEntities: boolean = false, clippingUrl: boolean = false) => {
	if (convertingEntities) {
		str = sanitizeText(str);
	}
	if (convertingUrl) {
		const url = /(https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+)/g;
		str = str.replace(url, (match, p1) => {
			const text = clippingUrl ? clipText(p1, 40, 0, "…") : p1;
			return `<a href='${p1}' target='_blank' rel='noopener noreferrer nofollow'>${text}</a>`;
		});
	}
	if (convertingHashtag) {
		// URLに含まれる # を除外する
		const url = /(https?:\/\/[^\s#]+)([#])([^\s#]+)/g;
		const hashtag = /[#＃]([^\s#＃'"`;:\-\!\?&@\.\+\-*~%\[\]\{\}\(\)○●△□「」『』（）]+)/gm;
		str = str.replace(url, "$1<HASHTAG>$3")
			.replace( hashtag, "<a href='https://www.youtube.com/hashtag/$1' target='_blank' rel='noopener noreferrer nofollow'>#$1</a>")
			.replace(/<HASHTAG>/g, '#');
	}
	return str;
}

export const toApproxNumber = (n:number, unit:string = ''): string => {
	let suffix = ((n < 1e4) ? '' : (n < 1e8) ? '万' : '億') + unit;
	let calcNum = (n < 1e4) ? n : (n < 1e8) ? (n / 1e4) : (n / 1e8);
	if(calcNum > 100 || calcNum % 1 === 0) {
		return `${ calcNum >> 0 }${ suffix }`;
	} else if(calcNum > 10) {
		return `${ calcNum.toFixed(1) }${ suffix }`;
	} else {
		return `${ calcNum.toFixed(2) }${ suffix }`;
	}
}

export const sanitizeText = (str: string): string => {
	return str.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

export const toUrl = (routeId:string, data:Object, absolute:boolean = true): string => {
	let path = routeId;
	for (const [key, value] of Object.entries(data)) {
		path = path.replace(`[${key}]`, value)
	}
	return `${ absolute ? '/' : '' }${ path }`;
}

export const toPlainText = (text:string) => {
	return text
		// aタグの解決
		.replace(/<a [^>]*?href="([\S]+?)".*?>([\s\S]+?)<\/a>\n/gi, "$2\n$1")
		.replace(/<a [^>]*?href="([\S]+?)".*?>([\s\S]+?)<\/a>/gi, "$2 ($1) ")
		// 置換
		.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")
		// &nbsp;を半角スペースに
		.replace(/&nbsp;/g, " ")
		// タブ、空行・重複スペース、重複改行の削除
		.replace(/\t/g, "")
		.replace(/^ +$/gm, "")
		.replace(/ +/g, " ")
		.replace(/\n{3,}/g, "\n\n")
		.replace(/^\n+|\n+$/g, "");
}

export const formatTime = (seconds:number) => {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.round(seconds % 60);
	return [
		h,
		m > 9 ? m : (h ? '0' + m : m || '0'),
		s > 9 ? s : '0' + s
	].filter(Boolean).join(':');
}