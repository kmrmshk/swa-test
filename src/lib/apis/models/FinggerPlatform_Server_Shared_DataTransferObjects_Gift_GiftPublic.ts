/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Fingger_Platform_Definitions_Enums_PaymentProductType } from './Fingger_Platform_Definitions_Enums_PaymentProductType';

export type FinggerPlatform_Server_Shared_DataTransferObjects_Gift_GiftPublic = {
  giftId?: string | null;
  name?: string | null;
  description?: string | null;
  tier?: number;
  productType?: Fingger_Platform_Definitions_Enums_PaymentProductType;
  price?: number;
  thumbnailImageUrl?: string | null;
};
