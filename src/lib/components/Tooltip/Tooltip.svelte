<script lang="ts">
	export let active:boolean = true;
	export let label:string;
	export let x:number = 0;
	export let y:number = 0;
	export let customClass:string = '';

	const baseClass = 'block py-1 px-6 fixed rounded-4px z-1 pointer-events-none';
	const bgClass = 'bg-base-dark bg-opacity-75 dark:bg-white dark:bg-opacity-75';
	const textClass = 'text-xs text-white dark:text-gray-900';

	let chip: HTMLDivElement;

	export function getBoundingClientRect() {
		return chip.getBoundingClientRect();
	}
</script>

{#if active}
	<div
		bind:this={ chip }
		class="{ baseClass } { bgClass } { textClass } { customClass } {$$props.class || ''}"
		style="top: { y }px; left: { x }px;"
	>{@html label ?? ''}</div>
{/if}