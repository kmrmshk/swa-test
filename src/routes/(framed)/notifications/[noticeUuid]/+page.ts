import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { NotificationsApi } from '$lib/apis';

export const load: PageLoad = async ({ params }) => {
	const noticeUuid = params?.noticeUuid ?? '';
	let notification = await NotificationsApi.getApiV1NotificationsGeneral1({
			uuid: noticeUuid
		})
		.catch(e => {
			console.error(e);
			return null;
		});

	if(!noticeUuid || !notification) {
		throw redirect(302, '/notifications');
	}

	return {
		noticeUuid,
		notification
	}
}
