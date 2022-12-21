import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { UsersApi } from '$lib/apis';

export const load: LayoutLoad = async ({ params }) => {
	const userUuid = params?.userUuid;
	const userData = await UsersApi.getApiV1Users({
		uuid: userUuid ?? ''
	})
		.catch(e => {
			console.error(e);
			return null;
		});
	if(!userData) {
		throw redirect(302, '/');
	}
	return {
		userUuid,
		userData
	};
};
