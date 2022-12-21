<script lang="ts">
	import { derived } from 'svelte/store';
	import { mobile } from '$lib/stores/device';
	import { smaller } from '$lib/stores/breakpoint';
	import { sidebar } from '$lib/stores/ui';
	import { dark } from '$lib/stores/theme';
	import Header from '$lib/components/GlobalHeader';
	import Sidebar from '$lib/components/GlobalSidebar';
	import { afterNavigate } from '$app/navigation';

	let scrollContainer:HTMLElement;
	let asMobile = derived([mobile, smaller('sm')], ([mb, sm]) => mb || sm);
	$: shrink = !$sidebar && !$asMobile;

	afterNavigate(() => {
		scrollContainer.scrollTop = 0;
	});
</script>

<div class="app-container grid gap-0 grid-rows-[3.5rem,1fr] { shrink ? 'grid-cols-[4rem,1fr]' : 'grid-cols-[15rem,1fr]'} fixed inset-0 w-full h-full overflow-hidden {$dark ? 'bg-gray-900' : 'bg-base-light' }"
	class:dark={ $dark }
	class:mobile={ $mobile }>
	<Header class="col-start-1 col-span-2 row-start-1"/>
	<!--通常状態-->
	<div
		bind:this={scrollContainer}
		class="inner-container { $asMobile ? 'col-start-1' : 'col-start-2'} relative col-start-1 col-span-2 row-start-2 overflow-x-hidden">
		<slot/>
	</div>
	<Sidebar class="col-start-1 {$asMobile ? 'row-start-1 row-span-2' : 'row-start-2 row-span-1'}"/>
</div>
