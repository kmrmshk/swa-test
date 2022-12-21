import type { PageLoad } from './$types';
import { GamesApi } from '$lib/apis';

const limit = 12;

export const load: PageLoad = async () => {
    const games = await GamesApi.getApiV1Games1({
        limit,
        offset: 0
    })
        .catch(e => {
            console.error(e);
            return [];
        });
    return {
        games
    };
};