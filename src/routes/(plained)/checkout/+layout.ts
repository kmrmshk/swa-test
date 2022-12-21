import type { LayoutLoad } from './$types';

const publishKey = `${ import.meta.env.stripe_publishablekey }`;
const purchasePattern = /^purchase\-(success|cancel)\/(.*)$/;

export const load:LayoutLoad = async ({ params, parent }) => {
    const result = purchasePattern.exec(params?.ids ?? '');
    if(result) {
        let [_, status, id] = result;
        return { publishKey, status, id };
    }
    return {
        publishKey,
        status: 'processing',
        id: params.ids
    };
};