<script lang="ts">
	import Card from '$lib/components/Card';
	import Avatar from '$lib/components/Avatar';
	import { goto } from '$app/navigation';

	export let uuid;
	export let thumbnailUrl;
	export let name;
</script>
<Card on:click={() => goto(`/users/${ uuid }`)}
	class="p-3 md:p-4 bg-white dark:bg-gray-900 w-full border-1 border-base-dark border-opacity-10 shadow-02dp cursor-pointer transition hover:shadow-06dp">
	<div class="flex items-center">
		<Avatar class="pointer-events-none w-12 h-12 sm:vmd:(w-20 h-20 rounded-5xl)" size={false} thumbnail={thumbnailUrl}/>
		<h4 class="ml-6 text-base-dark text-opacity-90 text-base font-bold md:text-xl">
			<span class="fi-lb line-clamp-2">{ name }</span>
		</h4>
	</div>
</Card>
