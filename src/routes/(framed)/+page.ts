import type { PageLoad } from './$types';
import { TopBannersApi } from '$lib/apis';

const host = `${ import.meta.env.vite_endpoint }`;

export const load:PageLoad = async () => {
	const bannerImages = await TopBannersApi.getApiV1Topbanners()
		.then(async data => {
			if( ! data.length ){
				return;
			}
			return data.map(({smallImageUrl, largeImageUrl, linkUrl})=>{
				return {
					sm: smallImageUrl,
					lg: largeImageUrl,
					href: String(linkUrl || '').replace(host, ''),
				};
			});
		})
		.catch(e => {
			console.error(e);
			return [];
		});
	return {
		bannerImages
	};
}