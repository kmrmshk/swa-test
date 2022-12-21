import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/services/firebase/server';
import { sessionKey } from '$lib/services/firebase/session';
import { KEY as themeKey } from '$lib/stores/theme';
import { KEY as sidebarKey } from '$lib/stores/ui';
import { ua } from '$lib/stores/device';

export const load: LayoutServerLoad = async ({ cookies, request }) => {
    const target = cookies.get(sessionKey) ?? null;
    let authUser = {};
    let theme = cookies.get(themeKey);
    let sidebar = cookies.get(sidebarKey);

    ua.set(request.headers.get('user-agent') ?? '');

    if(target) {
        const decoded = await auth.verifySessionCookie(target);
        authUser = { userId: decoded?.uid };
    }
    return {
        authUser,
        sidebar,
        theme
    };
};
