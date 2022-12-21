/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Terms_TermsVersionPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_Terms_TermsVersionPublic';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TermsApi {

  /**
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_Terms_TermsVersionPublic Success
   * @throws ApiError
   */
  public static getApiV1TermsLatestVersion(): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_Terms_TermsVersionPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/terms/latest-version',
    });
  }

}
