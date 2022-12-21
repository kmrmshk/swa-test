/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic';
import type { System_Ulid } from '../models/System_Ulid';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TagsApi {

  /**
   * 指定された Id と一致するタグを返します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic Success
   * @throws ApiError
   */
  public static getApiV1Tags({
tagId,
}: {
tagId: System_Ulid,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/tags/{tagId}',
      path: {
        'tagId': tagId,
      },
      errors: {
        400: `Bad Request`,
        500: `Server Error`,
      },
    });
  }

  /**
   * 指定件数タグの一覧を返します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic Success
   * @throws ApiError
   */
  public static getApiV1Tags1({
limit = 50,
offset,
}: {
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/tags',
      query: {
        'limit': limit,
        'offset': offset,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 指定されたタグで絞り込みをした人気配信の一覧を返します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic Success
   * @throws ApiError
   */
  public static getApiV1TagsDistributionsPopular({
originTagIds,
limit = 50,
offset,
}: {
originTagIds?: Array<System_Ulid>,
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/tags/distributions/popular',
      query: {
        'originTagIds': originTagIds,
        'limit': limit,
        'offset': offset,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 指定されたタグで絞り込みをした最新配信の一覧を返します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic Success
   * @throws ApiError
   */
  public static getApiV1TagsDistributionsLatest({
originTagIds,
limit = 50,
offset,
}: {
originTagIds?: Array<System_Ulid>,
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/tags/distributions/latest',
      query: {
        'originTagIds': originTagIds,
        'limit': limit,
        'offset': offset,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

}
