/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FinggerPlatform_Server_Shared_DataTransferObjects_Product_ProductAbilityPublic } from './FinggerPlatform_Server_Shared_DataTransferObjects_Product_ProductAbilityPublic';

export type FinggerPlatform_Server_Shared_DataTransferObjects_Item_ItemGroupedPublic = {
  productId?: string | null;
  name?: string | null;
  description?: string | null;
  readonly keywords?: Array<string> | null;
  thumbnailUrl?: string | null;
  amount?: number;
  productAbilities?: Array<FinggerPlatform_Server_Shared_DataTransferObjects_Product_ProductAbilityPublic> | null;
};
