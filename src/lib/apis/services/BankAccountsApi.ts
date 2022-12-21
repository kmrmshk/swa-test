/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinggerPlatform_Server_Shared_DataTransferObjects_BankAccount_TransferAmountDetailPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_BankAccount_TransferAmountDetailPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_BankAccount_WithdrawResultPublic } from '../models/FinggerPlatform_Server_Shared_DataTransferObjects_BankAccount_WithdrawResultPublic';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BankAccountsApi {

  /**
   * 銀行口座を作成します。
   * @returns boolean Success
   * @throws ApiError
   */
  public static postApiV1BankAccountsCreate({
bankCode,
branchCode,
accountType,
accountNumber,
accountName,
isAutoTransfer,
}: {
bankCode?: string,
branchCode?: string,
accountType?: string,
accountNumber?: string,
accountName?: string,
isAutoTransfer?: boolean,
}): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/bank-accounts/create',
      query: {
        'bankCode': bankCode,
        'branchCode': branchCode,
        'accountType': accountType,
        'accountNumber': accountNumber,
        'accountName': accountName,
        'isAutoTransfer': isAutoTransfer,
      },
      errors: {
        409: `Conflict`,
        500: `Server Error`,
      },
    });
  }

  /**
   * 銀行口座を更新します。
   * @returns boolean Success
   * @throws ApiError
   */
  public static patchApiV1BankAccounts({
bankAccountUuid,
bankCode,
branchCode,
accountType,
accountNumber,
accountName,
isAutoTransfer,
}: {
bankAccountUuid: string,
bankCode?: string,
branchCode?: string,
accountType?: string,
accountNumber?: string,
accountName?: string,
isAutoTransfer?: boolean,
}): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/bank-accounts/{bankAccountUuid}',
      path: {
        'bankAccountUuid': bankAccountUuid,
      },
      query: {
        'bankCode': bankCode,
        'branchCode': branchCode,
        'accountType': accountType,
        'accountNumber': accountNumber,
        'accountName': accountName,
        'isAutoTransfer': isAutoTransfer,
      },
      errors: {
        409: `Conflict`,
        500: `Server Error`,
      },
    });
  }

  /**
   * 銀行口座を削除します。
   * @returns boolean Success
   * @throws ApiError
   */
  public static deleteApiV1BankAccounts({
bankAccountUuid,
}: {
bankAccountUuid: string,
}): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/bank-accounts/{bankAccountUuid}',
      path: {
        'bankAccountUuid': bankAccountUuid,
      },
      errors: {
        409: `Conflict`,
        500: `Server Error`,
      },
    });
  }

  /**
   * 振込金額を計算します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_BankAccount_TransferAmountDetailPublic Success
   * @throws ApiError
   */
  public static getApiV1BankAccountsCalculateTransferAmount({
useDiamond,
}: {
useDiamond?: number,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_BankAccount_TransferAmountDetailPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/bank-accounts/calculate-transfer-amount',
      query: {
        'useDiamond': useDiamond,
      },
      errors: {
        500: `Server Error`,
      },
    });
  }

  /**
   * ダイヤを出金します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_BankAccount_WithdrawResultPublic Success
   * @throws ApiError
   */
  public static postApiV1BankAccountsWithdraw({
bankAccountUuid,
useDiamond,
}: {
bankAccountUuid?: string,
useDiamond?: number,
}): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_BankAccount_WithdrawResultPublic> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/bank-accounts/withdraw',
      query: {
        'bankAccountUuid': bankAccountUuid,
        'useDiamond': useDiamond,
      },
      errors: {
        409: `Conflict`,
        500: `Server Error`,
      },
    });
  }

  /**
   * 自分の最新の振込ステータスを返却します。
   * @returns FinggerPlatform_Server_Shared_DataTransferObjects_BankAccount_TransferAmountDetailPublic Success
   * @throws ApiError
   */
  public static getApiV1BankAccountsMeWithdrawalStatus(): CancelablePromise<FinggerPlatform_Server_Shared_DataTransferObjects_BankAccount_TransferAmountDetailPublic> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/bank-accounts/me/withdrawal-status',
      errors: {
        500: `Server Error`,
      },
    });
  }

}
