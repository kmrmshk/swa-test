/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic } from './FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_User_UserPublic } from './FinggerPlatform_Server_Shared_DataTransferObjects_User_UserPublic';

export type FinggerPlatform_Server_Shared_DataTransferObjects_Search_SearchResultPublic = {
  users?: Array<FinggerPlatform_Server_Shared_DataTransferObjects_User_UserPublic> | null;
  liveDistributionDetails?: Array<FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic> | null;
  completedDistributionLiveDetails?: Array<FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic> | null;
};
