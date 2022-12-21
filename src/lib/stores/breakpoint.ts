import { browser } from '$app/environment';
import { readable, derived } from 'svelte/store';
import { screens, verticals } from '$lib/styles/screens';

export const breakpoint = readable(undefined, set => {
	const match = browser ? {
		'xs': window.matchMedia(`(max-width: ${ screens.xs }px)`),
		'sm': window.matchMedia(`(min-width: ${ screens.sm }px) and (max-width: ${ screens.md - 1 }px)`),
		'md': window.matchMedia(`(min-width: ${ screens.md }px) and (max-width: ${ screens.lg - 1 }px)`),
		'lg': window.matchMedia(`(min-width: ${ screens.lg }px) and (max-width: ${ screens.xl - 1 }px)`),
		'xl': window.matchMedia(`(min-width: ${ screens.xl }px) and (max-width: ${ screens['2xl'] - 1 }px)`),
		'2xl': window.matchMedia(`(min-width: ${ screens['2xl'] }px) and (max-width: ${ screens['3xl'] - 1 }px)`),
		'3xl': window.matchMedia(`(min-width: ${ screens['3xl'] }px) and (max-width: ${ screens['4xl'] - 1 }px)`),
		'4xl': window.matchMedia(`(min-width: ${ screens['4xl'] }px) and (max-width: ${ screens['5xl'] - 1 }px)`),
		'5xl': window.matchMedia(`(min-width: ${ screens['5xl'] }px) and (max-width: ${ screens['6xl'] - 1 }px)`),
		'6xl': window.matchMedia(`(min-width: ${ screens['6xl'] }px)`)
	} : {};
    const matchers = Object.entries(match);
    const size = matchers.find(([_, queryList]) => queryList.matches);
    const sizeByMedia = Object.fromEntries(
		matchers.map(([size, queryList]) => [queryList.media, size])
    );
	if(browser && size?.length) {
	    set(size[0]);
	}
    function handleChange({ matches, media }) {
        const size = sizeByMedia[media];
        if (matches) {
	        set(size);
        }
    }
    matchers.forEach(([_, queryList]) =>
	    queryList.addEventListener("change", handleChange)
    );
    return () => {
		matchers.forEach(([_, queryList]) =>
			queryList.removeEventListener("change", handleChange)
		);
    };
});

export const breakpointVertical = readable(undefined, set => {
	const match = browser ? {
		'xs': window.matchMedia(`(max-height: ${verticals.xs}px)`),
		'sm': window.matchMedia(`(min-height: ${verticals.sm}px) and (max-height: ${verticals.md - 1}px)`),
		'md': window.matchMedia(`(min-height: ${verticals.md}px)`),
	} : {};
    const matchers = Object.entries(match);
    const size = matchers.find(([_, queryList]) => queryList.matches);
    const sizeByMedia = Object.fromEntries(
		matchers.map(([size, queryList]) => [queryList.media, size])
    );
	if(browser && size?.length) {
		set(size[0]);
	}
    function handleChange({ matches, media }) {
        const size = sizeByMedia[media];
        if (matches) {
	        set(size);
        }
    }
    matchers.forEach(([_, queryList]) =>
	    queryList.addEventListener("change", handleChange)
    );
    return () => {
		matchers.forEach(([_, queryList]) =>
			queryList.removeEventListener("change", handleChange)
		);
    };
});

export const smaller = (size, vertical = false) => {
	if(size in screens === false) {
		throw Error(`Invalid breakpoint size identifier "${size}"`);
	}
    return derived(
		vertical ? breakpointVertical : breakpoint,
	    ($size) => screens[$size] <= screens[size]
    );
};

export const larger = (size, vertical = false) => {
	if(size in screens === false) {
		throw Error(`Invalid breakpoint size identifier "${size}"`);
	}
    return derived(
		vertical ? breakpointVertical : breakpoint,
	    ($size) => screens[$size] >= screens[size]
    );
};

export const between = (sizeMin, sizeMax, vertical = false) => {
	return derived(
		[
			larger(sizeMin, vertical),
			smaller(sizeMax, vertical)
		],
		([s, l]) => s && l
	);
};

export default breakpoint;
