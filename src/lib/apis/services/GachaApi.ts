/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Gacha_GachaPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Gacha_GachaPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Item_ItemPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Item_ItemPublic';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GachaApi {

  /**
   * ガチャを回します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Item_ItemPublic Success
   * @throws ApiError
   */
  public static postApiV1GachaDraw({
gachaUuid,
distributionUuid,
}: {
gachaUuid: string,
distributionUuid?: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Item_ItemPublic> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/gacha/{gachaUuid}/draw',
      path: {
        'gachaUuid': gachaUuid,
      },
      query: {
        'distributionUuid': distributionUuid,
      },
      errors: {
        409: `Conflict`,
        500: `Server Error`,
      },
    });
  }

  /**
   * 指定されたバンドル ID に一致する有効なガチャを列挙します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Gacha_GachaPublic Success
   * @throws ApiError
   */
  public static getApiV1GachaGames({
bundleId,
}: {
bundleId: string,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Gacha_GachaPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/gacha/games/{bundleId}',
      path: {
        'bundleId': bundleId,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

}
