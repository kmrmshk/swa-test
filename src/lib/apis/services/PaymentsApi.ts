/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Payment_PaymentProductPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Payment_PaymentProductPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Payment_UserPaymentPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Payment_UserPaymentPublic';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PaymentsApi {

  /**
   * 有効な決済商品をすべて取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Payment_PaymentProductPublic Success
   * @throws ApiError
   */
  public static getApiV1PaymentsProductsCurrencies(): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Payment_PaymentProductPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/payments/products/currencies',
      errors: {
        404: `Not Found`,
      },
    });
  }

  /**
   * ユーザー決済を作成します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Payment_UserPaymentPublic Success
   * @throws ApiError
   */
  public static postApiV1Payments({
paymentProductUuid,
redirectBaseUrl,
}: {
paymentProductUuid?: string,
redirectBaseUrl?: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Payment_UserPaymentPublic> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/payments',
      query: {
        'paymentProductUuid': paymentProductUuid,
        'redirectBaseUrl': redirectBaseUrl,
      },
      errors: {
        404: `Not Found`,
      },
    });
  }

  /**
   * Stripe の Webhook を検知します。
   * @returns any Success
   * @throws ApiError
   */
  public static postApiV1PaymentsWebhookStripe(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/payments/webhook/stripe',
      errors: {
        404: `Not Found`,
      },
    });
  }

}
