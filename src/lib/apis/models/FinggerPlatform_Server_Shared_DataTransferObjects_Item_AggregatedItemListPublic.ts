/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FinggerPlatform_Server_Shared_DataTransferObjects_Game_GamePublic } from './FinggerPlatform_Server_Shared_DataTransferObjects_Game_GamePublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Item_ItemGroupedPublic } from './FinggerPlatform_Server_Shared_DataTransferObjects_Item_ItemGroupedPublic';

export type FinggerPlatform_Server_Shared_DataTransferObjects_Item_AggregatedItemListPublic = {
  game?: FinggerPlatform_Server_Shared_DataTransferObjects_Game_GamePublic;
  items?: Array<FinggerPlatform_Server_Shared_DataTransferObjects_Item_ItemGroupedPublic> | null;
};
