/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionPublic_YouTubePublic } from './FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionPublic_YouTubePublic';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic } from './FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic';

export type FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic = {
  uuid?: string | null;
  status?: string | null;
  privacyStatus?: string | null;
  bundleId?: string | null;
  previousBundleIds?: Array<string> | null;
  bundleIds?: Array<string> | null;
  distributorUuid?: string | null;
  title?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  scheduledStartAt?: string | null;
  scheduledEndAt?: string | null;
  actualStartAt?: string | null;
  actualEndAt?: string | null;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  concurrentViewers?: number;
  commentedUserCount?: number;
  itemUsedUserCount?: number;
  usedItemTotalPrice?: number;
  giftUsedUserCount?: number;
  usedGiftTotalPrice?: number;
  durationSeconds?: number | null;
  isOfficial?: boolean;
  youTube?: FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionPublic_YouTubePublic;
  isGiftEnable?: boolean;
  isGiftEffectEnable?: boolean;
  userName?: string | null;
  userThumbnailUrl?: string | null;
  gameTitle?: string | null;
  gameThumbnailUrl?: string | null;
  tags?: Array<FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic> | null;
};
