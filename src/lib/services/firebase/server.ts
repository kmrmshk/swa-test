import admin from 'firebase-admin';
import mapKeys from 'lodash/mapKeys';
import camelCase from 'lodash/camelCase';

const databaseEndpoint = String(import.meta.env.firebase_database_endpoint);
const credential = mapKeys(
	JSON.parse(import.meta.env.firebase_credentials),
	(v, k) => camelCase(k)
);

const app = admin.initializeApp({
	credential: admin.credential.cert(credential),
	databaseURL: databaseEndpoint
}, `server_${ new Date().getTime() }`);

export const auth = app.auth();