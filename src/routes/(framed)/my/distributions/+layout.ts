import type { LayoutLoad } from './$types';
import { TagsApi } from '$lib/apis';

export const load: LayoutLoad = async () => {
	const limit = 1000;
	const allTags = await TagsApi.getApiV1Tags1({
		limit,
		offset: 0
	});
	return {
		allTags
	};
};