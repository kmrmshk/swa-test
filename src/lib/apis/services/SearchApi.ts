/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Search_SearchResultPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Search_SearchResultPublic';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SearchApi {

  /**
   * 配信とユーザー情報を全文検索します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Search_SearchResultPublic Success
   * @throws ApiError
   */
  public static getApiV1Search({
searchWord,
searchType = 'All',
limit = 50,
offset,
}: {
searchWord?: string,
searchType?: string,
limit?: number,
offset?: number,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Search_SearchResultPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/search',
      query: {
        'searchWord': searchWord,
        'searchType': searchType,
        'limit': limit,
        'offset': offset,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

}
