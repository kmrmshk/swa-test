/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Campaign_CampaignCodePublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Campaign_CampaignCodePublic';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CampaignApi {

  /**
   * 有効なキャンペーンコード取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Campaign_CampaignCodePublic Success
   * @throws ApiError
   */
  public static getApiV1Campaign({
campaignCode,
}: {
campaignCode: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Campaign_CampaignCodePublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/campaign/{campaignCode}',
      path: {
        'campaignCode': campaignCode,
      },
    });
  }

}
