<script lang="ts">
	import {
		UsersApi,
		type FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic as DistributionDetailPublic,
		type FinggerPlatform_Server_Shared_DataTransferObjects_User_UserPublic as UserPublic
	} from '$lib/apis';
	import filter from 'lodash/filter';
	import LiveCard from '$lib/components/LiveCard';
	import InfiniteScroll from '$lib/components/InfiniteScroll';
	import Metatags from '$lib/components/Metatags';
	import { page } from '$app/stores';

	let userUuid:string;
	let userData:UserPublic;
	let scroll:InfiniteScroll;
	let promise = Promise.resolve();
	let archives:Array<DistributionDetailPublic> = [];

	$: ({ userUuid, userData } = $page.data);
	$: filteredList = filter(archives, item => item.status === 'Live' || item.status === 'Completed');

	function fetchDistributions() {
		return UsersApi.getApiV1UsersDistributions({
			uuid: userUuid,
			limit: 10,
			offset: archives.length
		})
			.then(list => {
				if(list?.length) {
					archives = archives.concat(list);
					scroll?.validate();
				}
			})
			.catch(console.error);
	}

	$: if (userUuid) {
		archives = [];
		scroll?.validate();
	}
</script>
<Metatags
	useSuffix
	useDescriptionSuffix
	title={ userData?.youTubeChannelTitle ?? '' }
	description={ userData?.youTubeChannelTitle ?? '' }
/>

<section
	class="m-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 5xl:grid-cols-7 6xl:grid-cols-8 gap-4">
	{#each filteredList as item }
		<LiveCard
			onAir={item.status !== 'Completed'}
			streamUuid={item.uuid}
			distributorUuid={item.distributorUuid}
			title={item.title}
			thumbnailUrl={item.thumbnailUrl}
			userName={ userData?.youTubeChannelTitle }
			userThumbnailUrl={ userData?.thumbnailUrl }
			viewersNum={item.status !== 'Completed' ? item.concurrentViewers : item.viewCount}
			startAt={item.actualStartAt}
			official={item.isOfficial}
			broadcastId={item.youTube.broadcastId}
			duration={item.durationSeconds}
			tags={item.tags}
		/>
	{/each}
	<InfiniteScroll
		bind:this={ scroll }
		on:more={ () => { promise = promise.then(fetchDistributions) } }
	/>
</section>