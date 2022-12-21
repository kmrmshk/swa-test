/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameCustomFramePublic } from './FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameCustomFramePublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameWebGlSettingsPublic } from './FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameWebGlSettingsPublic';

export type FinggerPlatform_Server_Shared_DataTransferObjects_Game_GamePublic = {
  bundleId?: string | null;
  title?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  version?: string | null;
  participationPrefixes?: Array<string> | null;
  gachaReleaseStatus?: string | null;
  releasedAt?: string;
  serviceEndAt?: string;
  gameWebGlSettings?: FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameWebGlSettingsPublic;
  gameCustomFrame?: FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameCustomFramePublic;
  isGiftEnable?: boolean;
  thumbnailImageUrl?: string | null;
  iconImageUrl?: string | null;
  bannerImageUrl?: string | null;
  licenseUrl?: string | null;
  canSoloPlay?: boolean;
};
