import { derived, writable } from 'svelte/store';
import { GiftsApi } from '$lib/apis';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Gift_GiftPublic as Gift } from '$lib/apis';

const assetBase = `${ import.meta.env.asset_endpoint }`;

const thumbnailMap = new Map<string, string>();

export const gifts = writable<Array<Gift>>([]);

// TODO: DB に登録済みのギフト画像をすべて返す API を用意してもらう
export function fetchByDistributionId(distributionId:string) {
    return GiftsApi.getApiV1GiftsGetonsale({ distributionId })
        .then(data => {
            gifts.set(data);
            data?.forEach(item => thumbnailMap.set(
                item.giftId ?? '',
                item.thumbnailImageUrl ?? ''
            ));
        })
        .catch(console.error);
}

// NOTE:
// 現状は DistributionUuid を元に、現在配信しているゲームで有効なギフトのみが返されるようになっている
// そのため、複数のゲームをプレイしていると現行のゲーム以外で使用できるギフト情報は参照できない
// 例えばコメントビューアを過去に遡って、別のゲームをプレイしていたときのゲーム専用ギフトを
// 使用したコメントを表示しようとするとサムネイル画像が見つからないといったケースがでてくる
// 現行はサムネイル画像情報がない場合は、旧仕様を活用して直接ファイルパスを生成しているが、
// いつまでこの仕組が使えるかははっきりしないので、なる早で解決しておかないといけない
export function getThumbnailById(giftId: string) {
    if(thumbnailMap.has(giftId)) {
        return thumbnailMap.get(giftId);
    } else {
        return `${assetBase}/platform/gifts/${giftId}.png`;
    }
};
