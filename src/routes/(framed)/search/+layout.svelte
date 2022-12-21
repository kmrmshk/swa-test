<script lang="ts">
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Tabs, TabNav, TabNavItem } from '$lib/components/Tabs';
	import { searchWords } from '$lib/stores/search';
	import { smaller } from '$lib/stores/breakpoint';
	import { encodeURI, decodeURI } from '$lib/functions/util';

	export let data:LayoutData;

	const { categories } = data;
	const small = smaller('sm');

	$: if ($page.url.search) {
		searchWords.set(decodeURI($page.url.searchParams.get('q') ?? ''));
	}

	$: searchWordsURI = encodeURI($searchWords);
</script>

<div class="w-full h-full">
	<div class="px-0 py-4 md:(py-7)">
		<Tabs secondary swipe={ $small } value={$page.route.id}>
			<TabNav spaceBetween={12} class="w-full mx-auto"
				offsetAfter={ $small ? 16 : 24 }
				offsetBefore={ $small ? 16 : 24 }
			>
				{#each categories as item}
					<TabNavItem
						path={item.path}
						on:click={ () => goto(`${ item.href }/?q=${ searchWordsURI}`) }
					>
						{ item.label }
					</TabNavItem>
				{/each}
			</TabNav>
		</Tabs>
	</div>
	<slot/>
</div>
