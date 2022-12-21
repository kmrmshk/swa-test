/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinggerPlatform_Server_DataTransferObjects_UserController_RequestUpdateBirthdate } from '../models/FinggerPlatform_Server_DataTransferObjects_UserController_RequestUpdateBirthdate';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Badge_BadgeInformationPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Badge_BadgeInformationPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_BankAccount_BankAccountPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_BankAccount_BankAccountPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_History_GachaHistoryPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_History_GachaHistoryPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_History_GiftHistoryPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_History_GiftHistoryPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_History_ItemHistoryPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_History_ItemHistoryPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_History_PaymentHistoryPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_History_PaymentHistoryPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_History_UserCurrencyHistoryPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_History_UserCurrencyHistoryPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_History_UserWithdrawalHistoryPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_History_UserWithdrawalHistoryPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Item_AggregatedItemListPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Item_AggregatedItemListPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Item_ItemPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Item_ItemPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_UserItemDailyRankingPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_UserItemDailyRankingPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_UserItemMonthlyRankingPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_UserItemMonthlyRankingPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_UserItemOverallRankingPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_UserItemOverallRankingPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_UserItemWeeklyRankingPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_UserItemWeeklyRankingPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Statistic_UserDistributionDailyStatisticPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Statistic_UserDistributionDailyStatisticPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Statistic_UserDistributionMonthlyStatisticPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Statistic_UserDistributionMonthlyStatisticPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_User_ActivateDistributorResultPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_User_ActivateDistributorResultPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_User_UserMePublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_User_UserMePublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_User_UserPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_User_UserPublic';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UsersApi {

  /**
   * ユーザーを作成します
   * @returns boolean Success
   * @throws ApiError
   */
  public static postApiV1UsersCreate({
xYouTubeAccessToken,
}: {
xYouTubeAccessToken?: string,
}): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/users/create',
      headers: {
        'X-YouTube-AccessToken': xYouTubeAccessToken,
      },
      errors: {
        404: `Not Found`,
      },
    });
  }

  /**
   * 自身を取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_User_UserMePublic Success
   * @throws ApiError
   */
  public static getApiV1UsersMe(): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_User_UserMePublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/me',
      errors: {
        404: `Not Found`,
      },
    });
  }

  /**
   * 指定された uuid と一致するユーザーを取得する
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_User_UserPublic Success
   * @throws ApiError
   */
  public static getApiV1Users({
uuid,
}: {
uuid: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_User_UserPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/{uuid}',
      path: {
        'uuid': uuid,
      },
      errors: {
        404: `Not Found`,
      },
    });
  }

  /**
   * 自分の配信一覧を取得する
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersMeDistributions({
status,
limit = 50,
offset,
}: {
status?: string,
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/me/distributions',
      query: {
        'status': status,
        'limit': limit,
        'offset': offset,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 指定の配信者の配信データ一覧を取得する
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersDistributions({
uuid,
limit = 50,
offset,
}: {
/**
 * 配信者
 */
uuid: string,
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/{uuid}/distributions',
      path: {
        'uuid': uuid,
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
   * 所持アイテム、Gameの情報を集約したリストを返します
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Item_AggregatedItemListPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersMeItemsAggregate({
bundleId,
limit = 50,
offset,
}: {
bundleId?: string,
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Item_AggregatedItemListPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/me/items/aggregate',
      query: {
        'bundleId': bundleId,
        'limit': limit,
        'offset': offset,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 自身の所持アイテムから、指定のステータスのものの一覧を返します
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Item_ItemPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersMeItems({
status,
limit = 50,
offset,
}: {
status: string,
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Item_ItemPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/me/items/{status}',
      path: {
        'status': status,
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
   * 消費アイテムのログを返します
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_History_ItemHistoryPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersMeHistoriesItems({
limit = 50,
offset,
}: {
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_History_ItemHistoryPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/me/histories/items',
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
   * ユーザーの決済履歴を返します
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_History_PaymentHistoryPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersMeHistoriesPayments({
limit = 50,
offset,
}: {
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_History_PaymentHistoryPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/me/histories/payments',
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
   * ガチャ履歴を取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_History_GachaHistoryPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersMeHistoriesGachas({
limit = 50,
offset,
}: {
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_History_GachaHistoryPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/me/histories/gachas',
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
   * ユーザー通貨のログを取得します
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_History_UserCurrencyHistoryPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersMeHistoriesCurrencies({
currencyType,
limit = 50,
offset,
}: {
currencyType?: string,
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_History_UserCurrencyHistoryPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/me/histories/currencies',
      query: {
        'currencyType': currencyType,
        'limit': limit,
        'offset': offset,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 出金履歴を取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_History_UserWithdrawalHistoryPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersMeHistoriesWithdrawals({
limit = 50,
offset,
}: {
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_History_UserWithdrawalHistoryPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/me/histories/withdrawals',
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
   * ギフト履歴
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_History_GiftHistoryPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersMeHistoriesGifts({
limit = 50,
offset,
}: {
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_History_GiftHistoryPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/me/histories/gifts',
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
   * 指定期間の日次統計を列挙します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Statistic_UserDistributionDailyStatisticPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersMeStatisticsDaily({
fromDate,
toDate,
}: {
fromDate?: string,
toDate?: string,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Statistic_UserDistributionDailyStatisticPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/me/statistics/daily',
      query: {
        'fromDate': fromDate,
        'toDate': toDate,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 指定期間の月次統計を列挙します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Statistic_UserDistributionMonthlyStatisticPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersMeStatisticsMonthly({
fromDate,
toDate,
}: {
fromDate?: string,
toDate?: string,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Statistic_UserDistributionMonthlyStatisticPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/me/statistics/monthly',
      query: {
        'fromDate': fromDate,
        'toDate': toDate,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * Daily アイテムランキングを列挙します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_UserItemDailyRankingPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersRankingsItemsDaily({
uuid,
date,
}: {
uuid: string,
date?: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_UserItemDailyRankingPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/{uuid}/rankings/items/daily',
      path: {
        'uuid': uuid,
      },
      query: {
        'date': date,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * Weekly アイテムランキングを列挙します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_UserItemWeeklyRankingPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersRankingsItemsWeekly({
uuid,
date,
}: {
uuid: string,
date?: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_UserItemWeeklyRankingPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/{uuid}/rankings/items/weekly',
      path: {
        'uuid': uuid,
      },
      query: {
        'date': date,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * Monthly アイテムランキングを列挙します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_UserItemMonthlyRankingPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersRankingsItemsMonthly({
uuid,
date,
}: {
uuid: string,
date?: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_UserItemMonthlyRankingPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/{uuid}/rankings/items/monthly',
      path: {
        'uuid': uuid,
      },
      query: {
        'date': date,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 累計アイテムランキングを列挙します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_UserItemOverallRankingPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersRankingsItemsOverAll({
uuid,
}: {
uuid: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_UserItemOverallRankingPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/{uuid}/rankings/items/over-all',
      path: {
        'uuid': uuid,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 有効な個人お知らせの未読数を取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Badge_BadgeInformationPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersMeBadges({
xYouTubeAccessToken,
}: {
xYouTubeAccessToken?: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Badge_BadgeInformationPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/me/badges',
      headers: {
        'X-YouTube-AccessToken': xYouTubeAccessToken,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 銀行口座の一覧を取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_BankAccount_BankAccountPublic Success
   * @throws ApiError
   */
  public static getApiV1UsersMeBankAccounts(): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_BankAccount_BankAccountPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/me/bank-accounts',
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * ユーザーの誕生日を更新します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_User_UserMePublic Success
   * @throws ApiError
   */
  public static putApiV1UsersMeBirthdate({
requestBody,
}: {
requestBody?: FinggerPlatform_Server_DataTransferObjects_UserController_RequestUpdateBirthdate,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_User_UserMePublic> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/users/me/birthdate',
      body: requestBody,
      mediaType: 'application/json-patch+json',
      errors: {
        400: `Bad Request`,
        500: `Server Error`,
      },
    });
  }

  /**
   * ユーザーの配信アクティベーションを行います。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_User_ActivateDistributorResultPublic Success
   * @throws ApiError
   */
  public static postApiV1UsersMeActivateDistributor(): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_User_ActivateDistributorResultPublic> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/users/me/activate-distributor',
      errors: {
        400: `Bad Request`,
        500: `Server Error`,
      },
    });
  }

}
