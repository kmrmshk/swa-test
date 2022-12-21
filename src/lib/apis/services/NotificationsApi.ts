/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Notification_GeneralNotificationPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Notification_GeneralNotificationPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Notification_NotificationInformationPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Notification_NotificationInformationPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Notification_UserNotificationPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Notification_UserNotificationPublic';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class NotificationsApi {

  /**
   * 全体お知らせの一覧を取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Notification_NotificationInformationPublic Success
   * @throws ApiError
   */
  public static getApiV1NotificationsGeneral({
limit = 2147483647,
offset,
}: {
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Notification_NotificationInformationPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/notifications/general',
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
   * 指定された Uuid に一致する全体お知らせを取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Notification_GeneralNotificationPublic Success
   * @throws ApiError
   */
  public static getApiV1NotificationsGeneral1({
uuid,
}: {
uuid: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Notification_GeneralNotificationPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/notifications/general/{uuid}',
      path: {
        'uuid': uuid,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 個人お知らせの一覧を取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Notification_NotificationInformationPublic Success
   * @throws ApiError
   */
  public static getApiV1NotificationsMe({
limit = 2147483647,
offset,
}: {
limit?: number,
offset?: number,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Notification_NotificationInformationPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/notifications/me',
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
   * 指定した Uuid に一致する個人お知らせを取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Notification_UserNotificationPublic Success
   * @throws ApiError
   */
  public static getApiV1NotificationsMe1({
uuid,
}: {
uuid: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Notification_UserNotificationPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/notifications/me/{uuid}',
      path: {
        'uuid': uuid,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

}
