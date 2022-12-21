import { browser } from '$app/environment';
import { writable, derived } from 'svelte/store';
import find from 'lodash/find';
import reduce from 'lodash/reduce';
import addDays from 'date-fns/addDays/index.js';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays/index.js';
import { persistent } from '$lib/functions/util';
import { UsersApi } from '$lib/apis';
import { requestBankDetail } from '$lib/functions/bankcode';
import { verifying, authUser } from '$lib/services/auth';

import type {
    FinggerPlatform_Server_Shared_DataTransferObjects_User_UserCurrencyPublic as UserCurrencyPublic,
    FinggerPlatform_Server_Shared_DataTransferObjects_BankAccount_BankAccountPublic as BankAccountPublic
} from '$lib/apis';

const exchangeableThreshold = 1000;
const expirationDays = 180;

const keyTermsAgreedAt = 'fi-terms-agreement-at';
const keyAgeRange = 'fi-app-age-range';
const keyParentalConsent = 'fi-parental-consent';
const keyActivated = 'fi-activated';

interface Channel {
    title: string,
    id: string
}

export interface BankAccount extends BankAccountPublic {
	bankName: string
}

// FIXME: 各画面から処したらここの定義も処す
export const uuid = derived(authUser, au => au?.userId ?? '');

export const termsAgreedAt = persistent<number>(keyTermsAgreedAt, (v) => Number(v || 0));
export const ageRange = persistent<number>(keyAgeRange, (v) => Number(v || 0));
export const parentalConsent = persistent<number>(keyParentalConsent, (v) => Number(v || 0));
export const distributorActivationStatus = persistent<string>(keyActivated, (v) => v || 'Disabled');

export const thumbnailUrl = writable<string>('');
export const channel = writable<Channel>({title: '', id: ''});
export const userCurrencies = writable<Array<UserCurrencyPublic>>([]);
export const pendingCurrency = writable<number>(0);
export const supportId = writable<string>('');
export const diamondAccumulatedAt = writable<Date|null>();
export const organizationType = writable<string>('Normal');

// Google/Firebaseの認証情報が使用できる状態、かつ、finggerユーザ情報も取得済みかどうか
export const prepared = derived([authUser, verifying], ([u, v]) => {
    return !!u?.userId && !v;
});

export function initStartWatchingStorage() {
    if(browser) {
        window.addEventListener('storage', e => {
            switch(e.key) {
                case keyTermsAgreedAt: termsAgreedAt.fetch(); break;
                case keyAgeRange:      ageRange.fetch(); break;
            }
        });
    }
}
export const coin = derived([userCurrencies, pendingCurrency], ([$currencies, $pendingCurrency]) => {
	return Math.max( 0, reduce($currencies, (sum, item) => {
			const amount = item.amount || 0;
			const additional = item.currencyType !== 'Diamond' ? amount : 0;
			return sum + additional;
	}, 0)- ($pendingCurrency || 0) );
});

export const diamond = derived(userCurrencies, $currencies => {
    const target = find($currencies, {currencyType: 'Diamond'});
    return target ? target.amount : 0;
});

export const remainingExchangeableDays = derived(diamondAccumulatedAt, $d => {
	if ($d === undefined || $d === null) {
		return expirationDays;
	}
	const expiringAt = addDays($d, expirationDays);
	return differenceInCalendarDays(expiringAt, new Date());
});

export const asManager = derived(organizationType, t => t === 'Organization');
export const asMember = derived(organizationType, t => t === 'Member');
export const activated = derived(distributorActivationStatus, s => s !== 'Disabled');
export const exchangeable = derived(diamond, (d = 0) => d >= exchangeableThreshold);
export const ageNotSettled = derived(ageRange, $ageRange => $ageRange === 0);
export const bankAccounts = (function (){
	const { subscribe, set, update } = writable<Array<BankAccount|null>>([]);
	const fetch = async () => {
		let items = await UsersApi.getApiV1UsersMeBankAccounts()
            .then(data => data.map(item => (<BankAccount|null>{ ...item })))
            .catch(e => {
                console.error(e);
                return [];
            });

        set(await Promise.all(
            items.map(item =>
                requestBankDetail(`${item?.bankCode}`)
                    .then(res => {
                        if(item) item.bankName = res.data.name;
                        return item;
                    })
                    .catch(e => {
                        console.error(e);
                        return null;
                    })
            )
        ));
	};
	return { fetch, subscribe, set, update };
})();

export const fetchUser = async () => {
    return UsersApi.getApiV1UsersMe()
        .then(data => {
            userCurrencies.set(data.userCurrencies ?? []);
            pendingCurrency.set(data.pendingCurrency ?? 0);
            thumbnailUrl.set(data.thumbnailUrl ?? '');
            supportId.set(data.supportId ?? '');
            channel.set({
                title: data.youTubeChannelTitle,
                id: data.youTubeChannelId,
            });
            ageRange.set(data.ageRange ?? null);
            diamondAccumulatedAt.set(data.diamondAccumulatedAt ? new Date(data.diamondAccumulatedAt) : null);
            distributorActivationStatus.set(data.distributorActivationStatus ?? null);
            organizationType.set(data?.organizationType ?? 'Normal');
        })
        .catch(console.error);
};
