import type { RequestHandler } from './$types';
import { serialize } from 'cookie';
import { auth } from '$lib/services/firebase/server';
import {
	invalidateUserTokensInMemory,
	// removeUserTokenFromDatabase
} from '$lib/services/firebase/database';
import { sessionKey } from '$lib/services/firebase/session';

const expiresIn = 1000 * 60 * 60 * 24 * 7; // 1 week

export const POST:RequestHandler = async ({ request }) => {
	// NOTE: set expired time to 1 hour
	const { idToken } = await request.json();
	if(!idToken) {
		return new Response(null, { status: 400 });
	}
	let sessionCookie;
	try {
		sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
	} catch (e) {
		return new Response(JSON.stringify(e), { status: 500 });
	}
	const headers = new Headers();
	headers.append('set-cookie', serialize(sessionKey, sessionCookie, {
		httpOnly: true,
		path: '/',
		secure: true,
		sameSite: 'lax',
		maxAge: expiresIn / 1000
	}));
	headers.append('Cache-Control', 'no-store');
	return new Response(JSON.stringify(!!sessionCookie), { headers });
}

export const DELETE:RequestHandler = async ({ cookies }) => {
	try {
		const idToken = cookies.get(sessionKey);
		const { uid } = await auth.verifySessionCookie(idToken);
		await auth.revokeRefreshTokens(uid);
		await invalidateUserTokensInMemory(uid);
		// FIXME: 複数プロファイルの同時利用も考慮してDBからは消さない
		// await removeUserTokenFromDatabase(uid);
	} catch (e) {
		return new Response(JSON.stringify(e), { status: 500 });
	}
	const headers = new Headers();
	headers.append('set-cookie', serialize(sessionKey, 'revoked', {
		maxAge: 0,
		path: '/'
	}));
	headers.append('Cache-Control', 'no-store');
	return new Response(undefined, { headers });
};