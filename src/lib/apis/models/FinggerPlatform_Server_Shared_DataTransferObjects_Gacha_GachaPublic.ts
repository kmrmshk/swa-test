/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FinggerPlatform_Server_Shared_DataTransferObjects_Gacha_GachaPublic_GachaContentPublic } from './FinggerPlatform_Server_Shared_DataTransferObjects_Gacha_GachaPublic_GachaContentPublic';

export type FinggerPlatform_Server_Shared_DataTransferObjects_Gacha_GachaPublic = {
  uuid?: string | null;
  bundleId?: string | null;
  name?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  price?: number;
  status?: string | null;
  startAt?: string;
  endAt?: string;
  contents?: Array<FinggerPlatform_Server_Shared_DataTransferObjects_Gacha_GachaPublic_GachaContentPublic> | null;
};
