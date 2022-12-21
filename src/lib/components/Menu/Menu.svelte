<script lang="ts">
	import clickOutside from '$lib/actions/clickOutside';
	import { fade } from 'svelte/transition';
	import { onMount, tick } from 'svelte';

	export let active = false;
	export let absolute = false;
	export let offsetX = true;
	export let offsetY = false;
	export let nudgeX = 0;
	export let nudgeY = 0;
	export let openOnClick = true;
	export let closeOnClickOutside = true;
	export let closeOnClick = false;
	export let bottom = false;
	export let right = false;
	export let disabled = false;
	export let index = 8;
	export let style = '';
	export let wrapperClass = 'relative inline-flex justify-center items-center';

	let position:string;
	let wrapper:HTMLDivElement;

	const align = {
		x: right ? 'right' : 'left',
		y: bottom ? 'bottom' : 'top'
	};
	export async function open(posX = 0, posY = 0) {
		active = true;
		await tick();
		const rect = wrapper.getBoundingClientRect();
		let x = nudgeX;
		let y = nudgeY;
		if (absolute) {
			x += posX;
			y += posY;
		} else {
			x += offsetX ? rect.width : 0;
			y += offsetY ? rect.height : 0;
		}
		position = `${align.y}:${y}px; ${align.x}:${x}px;`;
	}
	export async function close() {
		active = false;
		await tick();
	}
	function triggerClick(e) {
		if (!disabled) {
			if (active) {
				close();
			} else if (openOnClick) {
				open(e.offsetX, e.offsetY);
			}
		}
	}
	function menuClick() {
		(active && closeOnClick) && close();
	}
	function clickOutsideMenu() {
		(active && closeOnClickOutside) && close();
	}

	onMount(() => {
		const trigger = wrapper.querySelector("[slot='trigger']");
		if (active){
			open();
		}
		trigger && trigger.addEventListener('click', triggerClick, { passive: true });
		return () => {
			trigger && trigger.removeEventListener('click', triggerClick);
		};
	});
</script>

<div
	class={ wrapperClass }
	bind:this={ wrapper }
	use:clickOutside
	on:clickOutside={ clickOutsideMenu }>

	<slot name="trigger" />

	{#if active}
		<div
			class="menu absolute bg-white dark:bg-gray-800 rounded-lg py-2 {$$props.class || ''}"
			role="menu"
			on:click={menuClick}
			style="{position};z-index:{index};{style}"
			transition:fade|local={{duration: 75}} >
			<slot />
		</div>
	{/if}
</div>

<style>
	.menu::before {
		content: '';
		@apply block absolute top-0 w-full h-full rounded-lg shadow-06dp pointer-events-none;
	}
</style>