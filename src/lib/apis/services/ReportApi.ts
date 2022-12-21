/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinggerPlatform_Server_DataTransferObjects_ReportController_ReportRequest } from '../models/FinggerPlatform_Server_DataTransferObjects_ReportController_ReportRequest';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Report_ReportReasonPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Report_ReportReasonPublic';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ReportApi {

  /**
   * 有効な通報理由を列挙します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Report_ReportReasonPublic Success
   * @throws ApiError
   */
  public static getApiV1ReportReasons(): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Report_ReportReasonPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/report/reasons',
    });
  }

  /**
   * 配信を通報します。
   * @returns boolean Success
   * @throws ApiError
   */
  public static postApiV1ReportDistributions({
distributionUuid,
requestBody,
}: {
distributionUuid: string,
requestBody?: FinggerPlatform_Server_DataTransferObjects_ReportController_ReportRequest,
}): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/report/distributions/{distributionUuid}',
      path: {
        'distributionUuid': distributionUuid,
      },
      body: requestBody,
      mediaType: 'application/json-patch+json',
      errors: {
        403: `Forbidden`,
      },
    });
  }

  /**
   * コメントを通報します。
   * @returns boolean Success
   * @throws ApiError
   */
  public static postApiV1ReportComments({
commentUuid,
requestBody,
}: {
commentUuid: string,
requestBody?: FinggerPlatform_Server_DataTransferObjects_ReportController_ReportRequest,
}): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/report/comments/{commentUuid}',
      path: {
        'commentUuid': commentUuid,
      },
      body: requestBody,
      mediaType: 'application/json-patch+json',
      errors: {
        403: `Forbidden`,
      },
    });
  }

}
