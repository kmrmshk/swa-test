import { writable, derived } from 'svelte/store';
import parseISO from 'date-fns/parseISO/index.js';
import format from 'date-fns/format/index.js';
import { persistent } from '$lib/functions/util';
import get from 'lodash/get';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Notification_NotificationInformationPublic as Notification } from '$lib/apis';

// NOTE: 通常のお知らせに表示する種類名一覧
const defaultScheduleTypes = [
	'運営からのお知らせ'
];

export const publicPageNum = writable<number>(1);
export const privatePageNum = writable<number>(1);

export const readGeneralNotifications = persistent<number>('fi-read-general-notifications', (v) => Number(v || 0));

export const generalNotifications = (function () {
	const { subscribe, set } = writable<Notification>({targetType:'General', hasBadge:false, notifications:[]});
	return {
		subscribe,
		set: (value: Notification) => {
			set(addDate(value));
		}
	};
})();

export const userNotifications = (function () {
	const { subscribe, set } = writable<Notification>({targetType:'User', hasBadge:false, notifications:[]});
	return {
		subscribe,
		set: (value: Notification) => {
			set(addDate(value));
		}
	};
})();

export const generalNewsList = derived(generalNotifications, ($generalNotifications) => {
	return ($generalNotifications?.notifications ?? [])
		.filter( ({type}) => defaultScheduleTypes.some(t => type === t) === true );
});

export const specificItemList = derived(generalNotifications, ($generalNotifications) => {
	return ($generalNotifications?.notifications ?? [])
		.filter( ({type}) => defaultScheduleTypes.some(t => type === t) === false );
});

export const generalNotificationsBadge = derived([generalNewsList, readGeneralNotifications], ([$generalNewsList, $readGeneralNotifications]) => {
	// NOTE: お知らせの読み込みがないページでリロードした場合、1ミリ秒と比較することで generalNewsList が0の場合は未読、それ以外であれば既読とする
	return Number($readGeneralNotifications) < parseISO(get($generalNewsList, '0.publishedAt', new Date(1).toISOString())).getTime();
});

function addDate(data: Notification) {
	data.notifications = data.notifications.map(function (item) {
		item.date = format(parseISO(item.publishedAt), 'yyyy/MM/dd HH:mm');
		return item;
	});
	return data;
}
