/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Product_ProductPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Product_ProductPublic';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ProductsApi {

  /**
   * 指定された ProductId に一致する商品を取得します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Product_ProductPublic Success
   * @throws ApiError
   */
  public static getApiV1Products({
productId,
}: {
productId: string,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Product_ProductPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/products/{productId}',
      path: {
        'productId': productId,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * 指定された BundleId に一致する商品を列挙します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Product_ProductPublic Success
   * @throws ApiError
   */
  public static getApiV1ProductsGames({
bundleId,
}: {
bundleId: string,
}): CancelablePromise<Array<FinggerPlatform_Server_Shared_DataTransferObjects_Product_ProductPublic>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/products/games/{bundleId}',
      path: {
        'bundleId': bundleId,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

}
