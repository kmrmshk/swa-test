export type GoogleCredentials = {
	accessToken: string;
	expiresIn: number;
	idToken: string;
	refreshToken?: string;
	scope?: string;
	tokenType?: string
};

export type FirebaseCredentials = {
	emailVerified: string;
	expiresIn: string;
	federatedId: string;
	idToken: string;
	kind?: string;
	localId?: string;
	oauthAccessToken?: string;
	oauthExpireIn?: number;
	photoUrl?: string;
	providerId?: string;
	rawUserInfo?: string;
	refreshToken?: string;
};

export type StoredTokens = {
	google: GoogleCredentials;
	firebase: FirebaseCredentials;
	updatedAt: number;
};
