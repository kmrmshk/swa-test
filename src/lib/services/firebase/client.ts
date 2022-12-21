import type { FirebaseOptions } from '@firebase/app';
import { initializeApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';

const config: FirebaseOptions = {
	apiKey: String(import.meta.env.firebase_apikey),
	authDomain: String(import.meta.env.firebase_authdomain),
	projectId: String(import.meta.env.firebase_projectid),
	appId: String(import.meta.env.firebase_appid),
};
const app = initializeApp(config, `client_${ new Date().getTime() }`);

export const auth = getAuth(app);