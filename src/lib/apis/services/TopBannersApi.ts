/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinggerPlatform_Server_Shared_DataTransferObjects_TopBanner_TopBannerPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_TopBanner_TopBannerPublic';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TopBannersApi {

  /**
   * 有効なトップバナーを全件取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_TopBanner_TopBannerPublic Success
   * @throws ApiError
   */
  public static getApiV1Topbanners(): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_TopBanner_TopBannerPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/topbanners',
      errors: {
        500: `Server Error`,
      },
    });
  }

}
