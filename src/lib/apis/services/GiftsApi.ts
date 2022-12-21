/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinggerPlatform_Server_Controllers_GiftPurchaseRequest } from '../models/FinggerPlatform_Server_Controllers_GiftPurchaseRequest';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Gift_GiftPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Gift_GiftPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Gift_GiftPurchaseConfirmationPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Gift_GiftPurchaseConfirmationPublic';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GiftsApi {

  /**
   * 販売中のギフトの一覧を取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Gift_GiftPublic Success
   * @throws ApiError
   */
  public static getApiV1GiftsGetonsale({
distributionId,
}: {
distributionId: string,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Gift_GiftPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/gifts/{distributionId}/getonsale',
      path: {
        'distributionId': distributionId,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * ギフトの購入確認をします。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Gift_GiftPurchaseConfirmationPublic Success
   * @throws ApiError
   */
  public static postApiV1GiftsGetpurchaseconfirmation({
giftId,
}: {
giftId: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Gift_GiftPurchaseConfirmationPublic> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/gifts/{giftId}/getpurchaseconfirmation',
      path: {
        'giftId': giftId,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * ギフトの購入をします。
   * @returns any Success
   * @throws ApiError
   */
  public static postApiV1GiftsPurchase({
giftSellingId,
xYouTubeAccessToken,
requestBody,
}: {
giftSellingId: number,
xYouTubeAccessToken?: string,
requestBody?: FinggerPlatform_Server_Controllers_GiftPurchaseRequest,
}): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/gifts/{giftSellingId}/purchase',
      path: {
        'giftSellingId': giftSellingId,
      },
      headers: {
        'X-YouTube-AccessToken': xYouTubeAccessToken,
      },
      body: requestBody,
      mediaType: 'application/json-patch+json',
      errors: {
        500: `Server Error`,
      },
    });
  }

}
