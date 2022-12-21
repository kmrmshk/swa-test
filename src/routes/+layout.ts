import type { LayoutLoad } from './$types';
import theme, { THEME_LIGHT } from '$lib/stores/theme';
import { authUser } from '$lib/services/auth';
import { sidebar } from '$lib/stores/ui';

const categories = [
	{
		title: '人気',
		path: 'popular'
	},
	{
		title: '最新',
		path: 'latest'
	},
];

export const load: LayoutLoad = async ({ data }) => {
	if(data?.authUser) {
		authUser.set(data.authUser);
	}
	theme.set(data?.theme ?? THEME_LIGHT);
	sidebar.set(data?.sidebar ?? 1);

	return {
		categories
	};
};
