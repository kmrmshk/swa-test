/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Fingger_Platform_Definitions_Enums_PaymentProductType } from './Fingger_Platform_Definitions_Enums_PaymentProductType';

export type FinggerPlatform_Server_Shared_DataTransferObjects_Gift_GiftPurchaseConfirmationPublic = {
  giftId?: string | null;
  name?: string | null;
  giftSellingId?: number;
  productType?: Fingger_Platform_Definitions_Enums_PaymentProductType;
  price?: number;
  currentUserBalance?: number;
  afterUserBalance?: number;
};
