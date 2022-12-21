import admin from 'firebase-admin';
import NodeCache from 'node-cache';
import type { StoredTokens } from './types';
import { auth } from './server';
import type { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

const stdTTL = 3000;
const ttlOffset = 300; // 5 [min]

// FIXME: Redis入れたほうがよさそう
const tokenCache = new NodeCache();
const sessionCache = new NodeCache({stdTTL});

export const database = admin.database(auth.app);

function atob(base64:string) {
    var buffer = Buffer.from( base64, 'base64' );
    return buffer.toString('utf8');
}

function decode(token:string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var encodeURI = encodeURIComponent(atob(base64));
    var decodeString = decodeURIComponent(encodeURI);
    return JSON.parse(decodeString);
}

export async function getDecodedIdToken(idToken: string): Promise<DecodedIdToken | undefined> {
	const {sub} = decode(idToken);
	if(sessionCache.has(sub)) {
		return await sessionCache.get(sub);
	}
	const values = await auth.verifySessionCookie(idToken);
	sessionCache.set(sub, values);
	return values;
}

export async function getUserTokensByIdToken(idToken: string) {
	const decoded = await getDecodedIdToken(idToken);
	const userId = decoded?.uid ?? '';
	if(tokenCache.has(userId)) {
		return tokenCache.get<StoredTokens>(userId);
	}
	return await database.ref(userId)
		.once('value')
		.then(snapshot => {
			const values = snapshot.val();
			if(values) {
				const { firebase, updatedAt = 0 } = values;
				const expiresIn = firebase.oauthExpireIn ?? 0;
				const elapsedTime = (new Date().getTime() - updatedAt) / 1000;
				const ttl = Math.floor(expiresIn - elapsedTime - ttlOffset);
				// console.log('ttl ? ', ttl);
				if(ttl > 0) {
					tokenCache.set(userId, values, ttl);
				}
			}
			return values;
		})
		.catch(_ => undefined);
}

export async function setUserTokensToDatabase(tokens:StoredTokens) {
	const idToken = tokens?.firebase.idToken;
	const key = tokens?.firebase.localId;
	if(!key || !idToken) {
		throw Error('Invalid firebase localId or idToken');
	}
	const user = database.ref(key);
	return user.set(tokens)
		.then(_ => true)
		.catch(e => {
			console.error(e);
			return false;
		});
}

export async function invalidateUserTokensInMemory(localId: string) {
	if (tokenCache.has(localId)) {
		tokenCache.del(localId);
	}
	if(sessionCache.has(localId)) {
		sessionCache.del(localId);
	}
}

export async function removeUserTokenFromDatabase(localId: string) {
	return await database.ref(localId).remove();
}
