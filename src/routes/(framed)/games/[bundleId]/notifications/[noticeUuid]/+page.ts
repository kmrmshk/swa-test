import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { GamesApi, type FinggerPlatform_Server_Shared_DataTransferObjects_Notification_GameNotificationPublic as GameNotificationPublic } from '$lib/apis';
import format from 'date-fns/format/index.js';
import parseISO from 'date-fns/parseISO/index.js';

function fetchNotification(bundleId:string, noticeUuid:string){
	return GamesApi.getApiV1GamesNotifications({
		bundleId,
		uuid: noticeUuid
	})
		.catch(e => {
			console.error(e);
			return null;
		});
}

export const load: PageLoad = async ({ params }) => {
	const bundleId = params?.bundleId ?? '';
	const noticeUuid = params?.noticeUuid ?? '';
	let notification:GameNotificationPublic|null;
	notification = await fetchNotification(bundleId, noticeUuid);
	if(!noticeUuid || !notification) {
		throw redirect(302, `/games/${bundleId}/notifications`);
	}
	return {
		notification: {
			...notification,
			date: format(parseISO(notification.publishedAt ?? ''), 'yyyy/MM/dd HH:mm')
		}
	}
}
