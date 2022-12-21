import { writable } from 'svelte/store';

export const searchWords = writable('');
export const users = writable([]);
export const lives = writable([]);
export const archives = writable([]);