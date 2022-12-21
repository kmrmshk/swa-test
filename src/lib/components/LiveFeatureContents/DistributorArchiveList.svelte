<script lang="ts">
	import LiveCard from '$lib/components/LiveCard';
	import InfiniteScroll from '$lib/components/InfiniteScroll';
	import filter from 'lodash/filter';
	import { UsersApi } from '$lib/apis';

	export let distributorUuid:string;
	export let archiveUuid:string = '';
	export let gridOptions:string = '';

	let archives:Array<any> = [];
	let scroll:InfiniteScroll;
	let hasMore = true;

	$: filteredList = filter(archives, item => {
		return (item.status === 'Live' || item.status === 'Completed') && item.uuid !== archiveUuid;
	});

	function fetchArchives() {
		if(!accessible) {
			return;
		}
		return UsersApi
			.getApiV1UsersDistributions({
				uuid: distributorUuid,
				limit: 10,
				offset: archives.length
			})
			.then(data => {
				if (data.length) {
					archives = archives.concat(data);
				}
				hasMore = (data.length > 0);
				if(hasMore) {
					// NOTE: 追加読込が更に必要かどうか問い合わせる
					scroll?.validate();
				}
			});
	}

	$: accessible = archiveUuid && distributorUuid;

	$: if(distributorUuid) {
		archives = [];
		hasMore = true;
	}
</script>
<section
	class="px-7 pb-7 grid grid-cols-1 gap-4 { gridOptions }">
	{#each filteredList as item (item.uuid)}
		<LiveCard
			onAir={item.status !== 'Completed'}
			streamUuid={item.uuid}
			distributorUuid="{item.distributorUuid}"
			title={item.title}
			thumbnailUrl={item.thumbnailUrl}
			userName={item.userName}
			userThumbnailUrl={item.userThumbnailUrl}
			viewersNum={item.status !== 'Completed' ? item.concurrentViewers : item.viewCount}
			startAt={item.actualStartAt}
			official={item.isOfficial}
			duration={item.durationSeconds}
			tags={item.tags}
		/>
	{/each}
	<InfiniteScroll
		active={ accessible && hasMore }
		bind:this={ scroll }
		on:more={ () => fetchArchives() }
	/>
</section>
