/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinggerPlatform_Server_Shared_DataTransferObjects_ContentServer_ContentServerItemListPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_ContentServer_ContentServerItemListPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_ContentServer_ContentServerUserPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_ContentServer_ContentServerUserPublic';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ContentServerApi {

  /**
   * コンテンツサーバー用の JWT 認証トークンを生成します。
   * @returns any Success
   * @throws ApiError
   */
  public static getApiV1ContentserverToken({
bundleId,
}: {
/**
 * バンドル ID
 */
bundleId?: string,
}): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/contentserver/token',
      query: {
        'bundleId': bundleId,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * ユーザー情報を取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_ContentServer_ContentServerUserPublic Success
   * @throws ApiError
   */
  public static getApiV1ContentserverUser({
xFinggerContentServerKey,
xFinggerContentServerToken,
}: {
xFinggerContentServerKey?: string,
xFinggerContentServerToken?: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_ContentServer_ContentServerUserPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/contentserver/user',
      headers: {
        'X-Fingger-ContentServer-Key': xFinggerContentServerKey,
        'X-Fingger-ContentServer-Token': xFinggerContentServerToken,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 未使用アイテムの情報を取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_ContentServer_ContentServerItemListPublic Success
   * @throws ApiError
   */
  public static getApiV1ContentserverItems({
xFinggerContentServerKey,
xFinggerContentServerToken,
}: {
xFinggerContentServerKey?: string,
xFinggerContentServerToken?: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_ContentServer_ContentServerItemListPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/contentserver/items',
      headers: {
        'X-Fingger-ContentServer-Key': xFinggerContentServerKey,
        'X-Fingger-ContentServer-Token': xFinggerContentServerToken,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * アイテムを使用します。
   * @returns boolean Success
   * @throws ApiError
   */
  public static postApiV1ContentserverItems({
productAbilityId,
xYouTubeAccessToken,
xFinggerContentServerKey,
xFinggerContentServerToken,
distributionId,
additionalMessage,
}: {
productAbilityId: string,
xYouTubeAccessToken?: string,
xFinggerContentServerKey?: string,
xFinggerContentServerToken?: string,
distributionId?: string,
additionalMessage?: string,
}): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/contentserver/items/{productAbilityId}',
      path: {
        'productAbilityId': productAbilityId,
      },
      headers: {
        'X-YouTube-AccessToken': xYouTubeAccessToken,
        'X-Fingger-ContentServer-Key': xFinggerContentServerKey,
        'X-Fingger-ContentServer-Token': xFinggerContentServerToken,
      },
      query: {
        'distributionId': distributionId,
        'additionalMessage': additionalMessage,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

}
