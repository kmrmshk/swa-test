/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameEventPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameEventPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Game_GamePublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Game_GamePublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameRankingScorePublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameRankingScorePublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameRankingSettingPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameRankingSettingPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameScreenShotPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameScreenShotPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Notification_GameNotificationPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Notification_GameNotificationPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Notification_NotificationInformationPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Notification_NotificationInformationPublic';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GamesApi {

  /**
   * 指定されたバンドル ID のゲームを取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Game_GamePublic Success
   * @throws ApiError
   */
  public static getApiV1Games({
bundleId,
}: {
bundleId: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Game_GamePublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/games/{bundleId}',
      path: {
        'bundleId': bundleId,
      },
      errors: {
        404: `Not Found`,
        500: `Server Error`,
      },
    });
  }

  /**
   * 有効なゲームを列挙します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Game_GamePublic Success
   * @throws ApiError
   */
  public static getApiV1Games1({
limit = 50,
offset,
}: {
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Game_GamePublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/games',
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
   * ランキングの設定を取得します
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameRankingSettingPublic Success
   * @throws ApiError
   */
  public static getApiV1GamesRankingsSettings({
bundleId,
type,
}: {
bundleId: string,
type: string,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameRankingSettingPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/games/{bundleId}/rankings/settings/{type}',
      path: {
        'bundleId': bundleId,
        'type': type,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 期間指定無しでゲームのランキングを取得します
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameRankingScorePublic Success
   * @throws ApiError
   */
  public static getApiV1GamesRankingsOverall({
bundleId,
rankingId,
limit = 50,
offset,
}: {
bundleId: string,
rankingId: string,
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameRankingScorePublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/games/{bundleId}/rankings/{rankingId}/overall',
      path: {
        'bundleId': bundleId,
        'rankingId': rankingId,
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
   * 月間でのゲームのランキングを取得します
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameRankingScorePublic Success
   * @throws ApiError
   */
  public static getApiV1GamesRankingsMonthly({
bundleId,
rankingId,
month,
limit = 50,
offset,
}: {
bundleId: string,
rankingId: string,
month?: string,
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameRankingScorePublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/games/rankings/{bundleId}/{rankingId}/monthly',
      path: {
        'bundleId': bundleId,
        'rankingId': rankingId,
      },
      query: {
        'month': month,
        'limit': limit,
        'offset': offset,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * ゲームのスクリーンショットの一覧を取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameScreenShotPublic Success
   * @throws ApiError
   */
  public static getApiV1GamesScreenshots({
bundleId,
}: {
bundleId: string,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameScreenShotPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/games/{bundleId}/screenshots',
      path: {
        'bundleId': bundleId,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * ゲームのイベントの一覧を取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameEventPublic Success
   * @throws ApiError
   */
  public static getApiV1GamesEvents({
bundleId,
}: {
bundleId: string,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameEventPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/games/{bundleId}/events',
      path: {
        'bundleId': bundleId,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 有効なゲームお知らせを取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Notification_GameNotificationPublic Success
   * @throws ApiError
   */
  public static getApiV1GamesNotifications({
bundleId,
uuid,
}: {
bundleId: string,
uuid: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Notification_GameNotificationPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/games/{bundleId}/notifications/{uuid}',
      path: {
        'bundleId': bundleId,
        'uuid': uuid,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 有効なゲームお知らせの一覧を取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Notification_NotificationInformationPublic Success
   * @throws ApiError
   */
  public static getApiV1GamesNotifications1({
bundleId,
limit = 2147483647,
offset,
}: {
bundleId: string,
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Notification_NotificationInformationPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/games/{bundleId}/notifications',
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

}
