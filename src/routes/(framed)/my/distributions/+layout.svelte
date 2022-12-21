<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Tabs, TabNav, TabNavItem } from '$lib/components/Tabs';

	const categories = [
		{
			label: 'ライブ',
			href: '/my/distributions/streams',
			path: /\/my\/distributions\/(streams)?$/
		},
		{
			label: 'アーカイブ',
			href: '/my/distributions/archives',
			path: /\/my\/distributions\/archives$/
		}
	];
</script>

<div class="pt-4.5 pb-6 md:py-6">
	<Tabs value={ $page.url.toString() } secondary class="min-h-9">
		<TabNav centered spaceBetween={12} class="justify-center">
			{#each categories as item}
				<TabNavItem path={ item.path } on:click={ () => goto(item.href) }>{ item.label }</TabNavItem>
			{/each}
		</TabNav>
	</Tabs>
</div>
<slot />