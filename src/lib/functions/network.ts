import Tab from '$lib/functions/tab';
import { browser } from '$app/environment';

export let tab: Tab | null = browser ? new Tab('fi-sync') : null;

export const inspect = async () => {
    const target = `/favicon.png?${ new Date().getTime() }`
    try {
        await fetch(target);
    } catch {
        return false;
    }
    return true;
};