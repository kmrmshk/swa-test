import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';
import findIndex from 'lodash/findIndex';
import _get from 'lodash/get';
import _set from 'lodash/set';

import type {
	FinggerPlatform_Server_Shared_DataTransferObjects_Item_ItemGroupedPublic as ItemGrouped
} from '$lib/apis';

const prefix = 'fi::distributions::items@';

export const comments = writable<Array<any>>([]);
export const commentQueue = writable<Array<any>>([]);

export const createHistory = (distributionUuid:string) => {
	if(!browser) {
		return null;
	}
	const savedKey = `${prefix}${distributionUuid}`;
	const store = writable<Array<string>>([]);
	const values = localStorage.getItem(savedKey) || '';
	const arr = values.length ? values.split(',') : [];

	store.set(arr);

	return {
		...store,
		clear: () => {
			store.set([]);
			localStorage.removeItem(savedKey);
		},
		includes: (itemUuid:string) => {
			const list = get(store);
			return list.indexOf(itemUuid) > -1;
		},
		push: (itemUuid:string) => {
			store.update(list => {
				list.push(itemUuid);
				localStorage.setItem(savedKey, list.join(','));
				return list;
			});
		}
	};
};

const subtractable = () => {
	const store = writable<Array<ItemGrouped>>([]);
	const sub = (targetId:string) => {
		store.update(list => {
			const index = findIndex(list, item => {
				return _get(item, 'productId', '') === targetId;
			});
			if (index > -1) {
				let amount = _get(list[index], 'amount', 0);
				if (amount - 1 > 0) {
					_set(list[index], 'amount', Math.max(0, amount - 1));
				} else {
					list = list.filter((item, pos) => index !== pos);
				}
			}
			return list;
		});
	}
	return {...store, sub};
}
export const items = subtractable();

export const erase = (distributionUuid:string) => {
	browser && localStorage.removeItem(`${prefix}${distributionUuid}`);
};

export const clearAll = () => {
	if(!browser) {
		return;
	}
	const re = new RegExp(`^${prefix}.*$`);
	Object.entries(localStorage).map(item => item[0])
		.filter(item => item.match(re))
		.forEach(item => localStorage.removeItem(item));
}