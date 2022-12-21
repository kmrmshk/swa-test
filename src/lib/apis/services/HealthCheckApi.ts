/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HealthCheckApi {

  /**
   * @returns any Success
   * @throws ApiError
   */
  public static getApiV1Healthcheck(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/healthcheck',
      errors: {
        500: `Server Error`,
      },
    });
  }

}
