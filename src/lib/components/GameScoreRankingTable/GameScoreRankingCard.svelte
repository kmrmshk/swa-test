<script lang="ts">
	import Card from '$lib/components/Card';
	import Avatar from '$lib/components/Avatar';
	import Button from '$lib/components/Button';
	import { goto } from '$app/navigation';

	export let uuid = '';
	export let name = '';
	export let score = 0;
	export let rank = 0;
	export let rows = true;
	export let thumbnail = '';
	export let altar = false;
	export let to = '';

	let colorClass = '';
	let textClass = '';

	$: switch (true) {
		case rank === 1:
			colorClass = 'bg-amber-200 dark:bg-yellow-600 border-base-dark dark:border-white border-opacity-10 dark:border-opacity-12';
			textClass = 'bg-white font-bold text-amber-600 dark:text-yellow-600';
			break;
		case rank === 2:
			colorClass = 'bg-cyan-100 dark:bg-gray-600 border-base-dark dark:border-white border-opacity-10 dark:border-opacity-12';
			textClass = 'bg-white font-bold text-cyan-400 dark:text-gray-600';
			break;
		case rank === 3:
			colorClass = 'bg-orange-300 dark:bg-orange-800 border-base-dark dark:border-white border-opacity-10 dark:border-opacity-12';
			textClass = 'bg-white font-bold text-orange-600 dark:text-orange-800';
			break;
		default:
			colorClass = 'bg-white dark:(bg-gray-900 border-white border-opacity-12)';
			textClass = 'bg-white dark:(bg-gray-900) text-opacity-87';
	}

	$: layouts = rows
		? 'flex-row justify-between items-center'
		: 'flex-col justify-end items-center';

	function onClickedAvatar() {
		goto(`/users/${ uuid }`);
	}
</script>

<Card inline={false} vertical={false}
	rounded="lg"
	class="w-full p-2 h-16 border-1 {layouts} {colorClass} {$$props.class || ''}">
	{#if rows}
		<h4 class="inline-flex flex-shrink-0 w-6 h-6 rounded-full justify-center items-center text-sm {textClass}">{ rank }</h4>
	{/if}
	<slot name="thumbnail">
		<Avatar rounded="lg" class="w-12 h-12 ml-2 cursor-pointer"
			thumbnail={thumbnail}
			on:click={ onClickedAvatar }
		/>
	</slot>
	<div class="flex flex-col flex-grow content-start {rows ? 'pl-3' : 'w-full text-center justify-end'}">
		<h6 class="text-sm line-clamp-1 {rows || 'mb-1'}">{@html name}</h6>
		<p class="text-sm font-light">{ score }</p>
	</div>
	<slot/>
	{#if to}
		<Button plain large nogutters rounded="full" absolute={altar} class="self-end {altar ? 'p-2 bottom-0 right-0' : 'p-1 -bottom-1 -right-1'}" on:click={ () => goto(`/archives/${ to }`) } >
			<i class="icon fingger fingger-launch { `text-${ altar ? 'xl' : '2xl'}`}"></i>
		</Button>
	{/if}
</Card>