import { browser } from '$app/environment';
import { writable, readable, derived } from 'svelte/store';
import debounce from 'lodash/debounce';
import isMobile from 'ismobilejs/src/isMobile';

const orientationPortrait = 'portrait';
const orientationLandscape = 'landscape';

// 画面解像度
// NOTE: vw, vhでそれぞれCSS変数からも参照可能にしている
// FIXME: Client Hints API がサポート対象のブラウザで利用できるようになったら換装していく
export const viewport = readable({width: 0, height: 0}, set => {
	const onResized = debounce(() => {
		const width = window.innerWidth;
		const height = window.innerHeight;
		document.documentElement.style.setProperty('--vw', `${width}px`);
		document.documentElement.style.setProperty('--vh', `${height}px`);
		set({ width, height });
	}, 500, {
        leading: false,
        trailing: true
    });
    if(browser) {
        window.addEventListener('resize', onResized);
        onResized();
    }
    return () => {
        browser && window.removeEventListener('resize', onResized);
    };
});

export const ua = writable<string>(browser ? window.navigator.userAgent : '');
export const platform = derived(ua, $ua => isMobile($ua));
export const mobile = derived(platform, pf => pf.any);
export const phone = derived(platform, pf => pf.phone);
export const tablet = derived(platform, pf => pf.tablet);
export const desktop = derived(platform, pf => !pf.any);
export const ios = derived(platform, pf => pf.apple.device);
export const android = derived(platform, pf => pf.android.device);

// Orientationで判別
// FIXME: matchMedia で換装する
export const orientation = derived([platform, viewport], ([$pf, _]) => {
	if(!browser) {
		return null;
	}
	if (screen.orientation && Object.prototype.hasOwnProperty.call(window, 'onorientationchange')) {
		if (screen.orientation.type.indexOf(orientationPortrait) !== -1) {
			return orientationPortrait;
		}
		else if (screen.orientation.type.indexOf(orientationLandscape) !== -1) {
			return orientationLandscape;
		}
	} else if ($pf.apple.device && Object.prototype.hasOwnProperty.call(window, 'orientation')) {
		if (Math.abs(Number(window.orientation)) !== 90) {
			return orientationPortrait;
		}
		else if (Math.abs(Number(window.orientation)) === 90) {
			return orientationLandscape;
		}
	}
	return window.innerHeight / window.innerWidth > 1 ? orientationPortrait : orientationLandscape;
});
export const portrait = derived(orientation, $o => $o === 'portrait');
export const landscape = derived(orientation, $o => $o === 'landscape');
