<script lang="ts">
	import type { LayoutData } from './$types';
	import Metatags from '$lib/components/Metatags';
	import { strTrim } from '$lib/functions/util';
	import type { FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic as DistributionDetail } from '$lib/apis';

	export let data:LayoutData;
	let distribution:DistributionDetail;
	$: ({ distribution } = data);
</script>

<Metatags
	useSuffix
	title={ distribution?.title ?? undefined}
	description={ strTrim(distribution?.description ?? '', 150) }
	image={ distribution?.thumbnailUrl ?? '' }
	alt={ distribution?.title ?? undefined}
/>
<slot/>
