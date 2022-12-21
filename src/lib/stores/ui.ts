import { writable, derived } from 'svelte/store';
import { smaller } from '$lib/stores/breakpoint';
import Cookie from 'js-cookie';

export const KEY = 'fi_sidebar';

// サイドバーの表示/非表示フラグ
export const sidebar = ((initValue:number) => {
    const store = writable<number>(initValue);
    return {
        set: (value:any) => {
            store.set(parseInt(value));
            Cookie.set(KEY, `${ value }`, { path: '/', expires: 365 });
        },
        subscribe: store.subscribe
    };
})(1);

// ヘッダーの検索オーバーレイ（SP専用）
export const searchForm = writable(false);

// ログインモーダル
export const loginModal = writable(false);

// 記事
export const article = derived([smaller('sm'), smaller('xs', true)], ([h, v]) => h || v ? 'fi-article compact' : 'fi-article');

// コメントビューアのハッシュタグモード用ツールチップ
export const commentTips = writable(true);