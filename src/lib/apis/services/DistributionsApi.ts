/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Fingger_Platform_Interop_YouTube_Videos_Entities_Rating } from '../models/Fingger_Platform_Interop_YouTube_Videos_Entities_Rating';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionCompositionPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionCompositionPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_DistributionItemRankingPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_DistributionItemRankingPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic';
import type { System_Ulid } from '../models/System_Ulid';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DistributionsApi {

  /**
   * おすすめ配信一覧を返します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic Success
   * @throws ApiError
   */
  public static getApiV1DistributionsRecommended({
limit = 10,
offset,
}: {
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/distributions/recommended',
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
   * 人気配信一覧を返します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic Success
   * @throws ApiError
   */
  public static getApiV1DistributionsPopular({
limit = 50,
offset,
}: {
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/distributions/popular',
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
   * 最新の配信一覧を返します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic Success
   * @throws ApiError
   */
  public static getApiV1DistributionsLatest({
limit = 50,
offset,
}: {
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/distributions/latest',
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
   * ゲームごとの人気配信一覧を返します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic Success
   * @throws ApiError
   */
  public static getApiV1DistributionsGamesPopular({
bundleId,
limit = 50,
offset,
}: {
bundleId: string,
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/distributions/games/{bundleId}/popular',
      path: {
        'bundleId': bundleId,
      },
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
   * ゲームごとの最新配信一覧を返します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic Success
   * @throws ApiError
   */
  public static getApiV1DistributionsGamesLatest({
bundleId,
limit = 50,
offset,
}: {
bundleId: string,
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/distributions/games/{bundleId}/latest',
      path: {
        'bundleId': bundleId,
      },
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
   * 自身が予約している配信の一覧を返します
 * - PF上で予約した配信
 * - YouTube で予約した配信(youTubeAccessTokenを指定した場合)
 * - bilibili で予約した配信(未対応)
 * をまとめて重複を排除して返す
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionCompositionPublic Success
   * @throws ApiError
   */
  public static getApiV1DistributionsMyUpcomings({
xYouTubeAccessToken,
}: {
xYouTubeAccessToken?: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionCompositionPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/distributions/my-upcomings',
      headers: {
        'X-YouTube-AccessToken': xYouTubeAccessToken,
      },
      errors: {
        401: `Unauthorized`,
        500: `Server Error`,
      },
    });
  }

  /**
   * 配信の予約登録を行う
 * LiveStreaming サービスにすでに登録されている配信を元に、PF上の配信予約データを作成する
 * TODO: LiveStreaming サービスが複数になったら、PFで作成済みの配信予約データに別の LiveStreaming サービスの配信を紐づけるAPIも必要
 * 冪等性を持つ。識別子 となるのは youTubeBroadcastId
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionPublic Success
   * @throws ApiError
   */
  public static putApiV1Distributions({
xYouTubeAccessToken,
bundleId,
youTubeBroadcastId,
privacyStatus = 'public',
isGiftEnable = true,
isGiftEffectEnable = true,
campaignCode,
}: {
/**
 * 強い認可を持つユーザ自身のアクセストークン。liveStreamingType="YouTube" の場合必須
 */
xYouTubeAccessToken?: string,
bundleId?: string,
youTubeBroadcastId?: string,
privacyStatus?: string,
isGiftEnable?: boolean,
isGiftEffectEnable?: boolean,
campaignCode?: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionPublic> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/distributions',
      headers: {
        'X-YouTube-AccessToken': xYouTubeAccessToken,
      },
      query: {
        'bundleId': bundleId,
        'youTubeBroadcastId': youTubeBroadcastId,
        'privacyStatus': privacyStatus,
        'isGiftEnable': isGiftEnable,
        'isGiftEffectEnable': isGiftEffectEnable,
        'campaignCode': campaignCode,
      },
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
        500: `Server Error`,
      },
    });
  }

  /**
   * 配信を開始する
 * 配信データはPF上にすでに存在している
 * LiveStreaming サービスに既存
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionPublic Success
   * @throws ApiError
   */
  public static patchApiV1DistributionsStart({
uuid,
xYouTubeAccessToken,
privacyStatus = 'public',
isGiftEnable = true,
isGiftEffectEnable = true,
campaignCode,
requestBody,
}: {
/**
 * 配信を始めていない配信のID(PF上のID)
 */
uuid: string,
/**
 * 強い認可を持つユーザ自身のアクセストークン。配信先にYouTubeを含む場合は必須
 */
xYouTubeAccessToken?: string,
privacyStatus?: string,
isGiftEnable?: boolean,
isGiftEffectEnable?: boolean,
campaignCode?: string,
requestBody?: Array<System_Ulid>,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionPublic> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/distributions/{uuid}/start',
      path: {
        'uuid': uuid,
      },
      headers: {
        'X-YouTube-AccessToken': xYouTubeAccessToken,
      },
      query: {
        'privacyStatus': privacyStatus,
        'isGiftEnable': isGiftEnable,
        'isGiftEffectEnable': isGiftEffectEnable,
        'campaignCode': campaignCode,
      },
      body: requestBody,
      mediaType: 'application/json-patch+json',
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
      },
    });
  }

  /**
   * ゲームプレイのスタート
 * すでに配信が始まっている配信で、ゲームを変更する時に使用
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionPublic Success
   * @throws ApiError
   */
  public static postApiV1DistributionsGameplayStart({
uuid,
bundleId,
}: {
uuid: string,
bundleId?: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionPublic> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/distributions/{uuid}/gameplay/start',
      path: {
        'uuid': uuid,
      },
      query: {
        'bundleId': bundleId,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 配信のステータスを変更します。
   * @returns boolean Success
   * @throws ApiError
   */
  public static patchApiV1DistributionsStatus({
uuid,
status,
xYouTubeAccessToken,
}: {
uuid: string,
status?: string,
xYouTubeAccessToken?: string,
}): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/distributions/{uuid}/status',
      path: {
        'uuid': uuid,
      },
      headers: {
        'X-YouTube-AccessToken': xYouTubeAccessToken,
      },
      query: {
        'status': status,
      },
      errors: {
        404: `Not Found`,
        500: `Server Error`,
      },
    });
  }

  /**
   * 配信の公開設定を変更します。
   * @returns boolean Success
   * @throws ApiError
   */
  public static patchApiV1DistributionsPrivacyStatus({
uuid,
privacyStatus,
xYouTubeAccessToken,
}: {
uuid: string,
privacyStatus?: string,
xYouTubeAccessToken?: string,
}): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/distributions/{uuid}/privacy-status',
      path: {
        'uuid': uuid,
      },
      headers: {
        'X-YouTube-AccessToken': xYouTubeAccessToken,
      },
      query: {
        'privacyStatus': privacyStatus,
      },
      errors: {
        404: `Not Found`,
        500: `Server Error`,
      },
    });
  }

  /**
   * 配信のギフト設定を変更します。
   * @returns boolean Success
   * @throws ApiError
   */
  public static patchApiV1DistributionsGiftStatus({
uuid,
isGiftEnable = true,
isGiftEffectEnable = true,
xYouTubeAccessToken,
}: {
uuid: string,
isGiftEnable?: boolean,
isGiftEffectEnable?: boolean,
xYouTubeAccessToken?: string,
}): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/distributions/{uuid}/gift-status',
      path: {
        'uuid': uuid,
      },
      headers: {
        'X-YouTube-AccessToken': xYouTubeAccessToken,
      },
      query: {
        'isGiftEnable': isGiftEnable,
        'isGiftEffectEnable': isGiftEffectEnable,
      },
      errors: {
        404: `Not Found`,
        500: `Server Error`,
      },
    });
  }

  /**
   * 配信のタグを変更します。
   * @returns boolean Success
   * @throws ApiError
   */
  public static patchApiV1DistributionsTags({
uuid,
requestBody,
}: {
uuid: string,
requestBody?: Array<System_Ulid>,
}): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/distributions/{uuid}/tags',
      path: {
        'uuid': uuid,
      },
      body: requestBody,
      mediaType: 'application/json-patch+json',
      errors: {
        404: `Not Found`,
        500: `Server Error`,
      },
    });
  }

  /**
   * 指定された配信のタグの一覧を返します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic Success
   * @throws ApiError
   */
  public static getApiV1DistributionsTags({
uuid,
}: {
uuid: string,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/distributions/{uuid}/tags',
      path: {
        'uuid': uuid,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 配信データを取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic Success
   * @throws ApiError
   */
  public static getApiV1Distributions({
uuid,
part,
}: {
uuid: string,
part?: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/distributions/{uuid}',
      path: {
        'uuid': uuid,
      },
      query: {
        'part': part,
      },
      errors: {
        404: `Not Found`,
        500: `Server Error`,
      },
    });
  }

  /**
   * いいねをします
   * @returns boolean Success
   * @throws ApiError
   */
  public static getApiV1DistributionsLike({
distributionUuid,
rate,
xYouTubeAccessToken,
}: {
distributionUuid?: string,
rate?: Fingger_Platform_Interop_YouTube_Videos_Entities_Rating,
xYouTubeAccessToken?: string,
}): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/distributions/like',
      headers: {
        'X-YouTube-AccessToken': xYouTubeAccessToken,
      },
      query: {
        'distributionUuid': distributionUuid,
        'rate': rate,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * いいねしているかの確認
   * @returns Fingger_Platform_Interop_YouTube_Videos_Entities_Rating Success
   * @throws ApiError
   */
  public static getApiV1DistributionsGetLike({
distributionUuid,
xYouTubeAccessToken,
}: {
distributionUuid?: string,
xYouTubeAccessToken?: string,
}): CancelablePromise<Fingger_Platform_Interop_YouTube_Videos_Entities_Rating> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/distributions/get-like',
      headers: {
        'X-YouTube-AccessToken': xYouTubeAccessToken,
      },
      query: {
        'distributionUuid': distributionUuid,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * コメントを各種LiveStreamingサービスに投げます。
   * @returns boolean Success
   * @throws ApiError
   */
  public static postApiV1DistributionsComments({
uuid,
text,
xYouTubeAccessToken,
}: {
uuid: string,
text?: string,
xYouTubeAccessToken?: string,
}): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/distributions/{uuid}/comments',
      path: {
        'uuid': uuid,
      },
      headers: {
        'X-YouTube-AccessToken': xYouTubeAccessToken,
      },
      query: {
        'text': text,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * アイテム使用コメントを各種LiveStreamingサービスに投げます。
   * @returns boolean Success
   * @throws ApiError
   */
  public static postApiV1DistributionsCommentsItem({
uuid,
productId,
additionalMessage,
xYouTubeAccessToken,
}: {
uuid: string,
productId?: string,
additionalMessage?: string,
xYouTubeAccessToken?: string,
}): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/distributions/{uuid}/comments/item',
      path: {
        'uuid': uuid,
      },
      headers: {
        'X-YouTube-AccessToken': xYouTubeAccessToken,
      },
      query: {
        'productId': productId,
        'additionalMessage': additionalMessage,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * アイテムランキングを取得します
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_DistributionItemRankingPublic Success
   * @throws ApiError
   */
  public static getApiV1DistributionsRankingsItem({
uuid,
}: {
uuid: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_DistributionItemRankingPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/distributions/{uuid}/rankings/item',
      path: {
        'uuid': uuid,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

}
