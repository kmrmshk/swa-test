import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import isbot from 'isbot';

export const load: PageServerLoad = ({ request, params }) => {
	const distributonUuid: string = params?.archiveUuid ?? '';
	const isBot = isbot(request.headers.get('user-agent'));
	if (isBot) {
		throw redirect(302, `/archives/${ distributonUuid }/bot`);
	}
}
