import type { LayoutLoad } from './$types';

const categoryAll = {
	label: '全て',
	type: 'All',
	href: `/search`,
	path: /^search\/?(\[query\])*$/,
};

const categoryUsers = {
	label: 'ユーザー',
	type: 'User',
	href: `/search/users`,
	path: /^search\/users\/?(\[query\])*$/,
};

const categoryLives = {
	label: 'ライブ',
	type: 'DistributionLive',
	href: `/search/lives`,
	path: /^search\/lives\/?(\[query\])*$/,
};

const categoryArchives = {
	label: 'アーカイブ',
	type: 'DistributionCompleted',
	href: `/search/archives`,
	path: /^search\/archives\/?(\[query\])*$/,
};

const categories = [
	categoryAll,
	categoryUsers,
	categoryLives,
	categoryArchives,
];

export const load:LayoutLoad = () => {
	return {
		categoryAll,
		categoryUsers,
		categoryLives,
		categoryArchives,
		categories,
	}
};