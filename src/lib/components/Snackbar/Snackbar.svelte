<script lang="ts">
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment';

	type MessageInfo = {
		message: string;
		time: number;
	};

	export let active = true;
	export let top = false;
	export let left = false;
	export let bottom = false;
	export let right = false;
	export let center = false;
	export let fixed = false;

	const flyOption = { y: 30 * (top ? -1 : 1), duration: 250 };
	const defaultClass = 'snackbar m-2 px-4 py-3 flex items-center absolute pointer-events-auto cursor-pointer min-h-12 min-w-21 bg-black dark:bg-white rounded-lg';
	const innerClass= 'fi-lb text-white dark:text-gray-900 w-full';

	let list:Array<MessageInfo> = [];
	let odd = false;
	let message = '';
	let timeoutId = 0;

	function setMessage(){
		if(!browser) return;
		window.clearTimeout(timeoutId);
		odd = !odd;
		if(list.length){
			message = list[0].message;
			timeoutId = window.setTimeout(shift, list[0].time);
		}
		else{
			message = '';
		}
	}

	function shift(){
		list.shift();
		setMessage();
	}

	export function push( message:string, time = 3000 ){
		list.push({ message, time });
		if( list.length == 1 ){
			setMessage();
		}
	}

	export function unshift( message:string, time = 3000, shift = true ){
		if( !list.length ){
			push(message, time);
		}
		else if( shift ){
			list.splice(0, 1, { message, time });
			setMessage();
		}
		else{
			list.splice(1, 0, { message, time });
		}
	}

	export function clear(){
		list = [];
		message = '';
		browser && window.clearTimeout(timeoutId);
	}
</script>

<div
	class="wrapper p-4 flex fixed z-100 pointer-events-none w-full inset-0"
	class:top
	class:left
	class:bottom
	class:right
	class:center
	class:fixed
>
	{#if message.length && active}
		{#if odd}
			<div
				on:click={shift}
				transition:fly={flyOption}
				style="{$$props.style || ''}"
				class="{defaultClass} {$$props.class || ''}">
				<p class="{innerClass}">
					{@html message}
				</p>
			</div>
		{:else}
			<div
				on:click={shift}
				transition:fly={flyOption}
				style="{$$props.style || ''}"
				class="{defaultClass} {$$props.class || ''}">
				<p class="{innerClass}">
					{@html message}
				</p>
			</div>
		{/if}
	{/if}
</div>

<style lang="scss">
	.wrapper {
		&.center {
			@apply justify-center items-center;
		}
		&.fixed {
			position: fixed;
		}
		&:not(.fixed) {
			position: absolute;
		}
		&.left {
			@apply justify-start;
		}
		&.top {
			@apply items-start;
		}
		&.right {
			@apply justify-end;
		}
		&.bottom {
			@apply items-end;
		}
	}
</style>