import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { NotificationsApi } from '$lib/apis';
import { authorized } from '$lib/services/auth';
import { get } from 'svelte/store';

export const load: PageLoad = async ({ params }) => {
	const noticeUuid = params?.noticeUuid ?? '';
	const notification = await NotificationsApi.getApiV1NotificationsMe1({
			uuid: noticeUuid
		})
		.catch(e => {
			console.error(e);
			return null;
		});

	if(!get(authorized) || !noticeUuid || !notification) {
		throw redirect(302, '/notifications/inbox');
	}

	return {
		noticeUuid,
		notification
	}
}
