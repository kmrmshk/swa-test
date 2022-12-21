/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Fingger_Platform_Definitions_Enums_AgeRange } from './Fingger_Platform_Definitions_Enums_AgeRange';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_User_UserCurrencyPublic } from './FinggerPlatform_Server_Shared_DataTransferObjects_User_UserCurrencyPublic';

export type FinggerPlatform_Server_Shared_DataTransferObjects_User_UserMePublic = {
  uuid?: string | null;
  thumbnailUrl?: string | null;
  youTubeChannelId?: string | null;
  youTubeChannelTitle?: string | null;
  youTubeChannelDescription?: string | null;
  subscriberCount?: number;
  supportId?: string | null;
  userCurrencies?: Array<FinggerPlatform_Server_Shared_DataTransferObjects_User_UserCurrencyPublic> | null;
  pendingCurrency?: number;
  ageRange?: Fingger_Platform_Definitions_Enums_AgeRange;
  diamondAccumulatedAt?: string | null;
  distributorActivationStatus?: string | null;
  isClosedBetaTestDistributor?: boolean;
  organizationType?: string | null;
};
