import { derived, writable } from 'svelte/store';
import Cookie from 'js-cookie';

export const KEY = 'fi_theme';
export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';

const theme = writable<string>(THEME_LIGHT);

function save(value: string) {
    theme.set(value);
    Cookie.set(KEY, value, {
        path: '/',
        expires: 365
    });
}

export const dark = derived(theme, t => t === THEME_DARK);
export const light = derived(theme, t => t === THEME_LIGHT);

export default {
    save,
    set: theme.set,
    subscribe: theme.subscribe
};