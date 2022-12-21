/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Organization_OrganizationPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Organization_OrganizationPublic';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OrganizationsApi {

  /**
   * 自分に紐づく現在有効な組織メンバーの一覧を取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Organization_OrganizationPublic Success
   * @throws ApiError
   */
  public static getApiV1OrganizationsMeMembers(): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Organization_OrganizationPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/organizations/me/members',
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 組織メンバーのダイヤ取得履歴 CSV ファイルをダウンロードします。
   * @returns any Success
   * @throws ApiError
   */
  public static getApiV1OrganizationsMeDiamondHistoryExport({
month,
}: {
month?: string,
}): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/organizations/me/diamond-history-export',
      query: {
        'month': month,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

}
