<script lang="ts">
	import { dark } from '$lib/stores/theme';
	import isEmpty from 'lodash/isEmpty';
	import clickOutside from '$lib/actions/clickOutside';

	export let placeholder = '';
	export let list = [];
	export let value = '';
	export let error = '';
	export let disabled = false;

	let selecting = false;
</script>

<div
	class="wrapper { $$props.class || '' }"
	use:clickOutside
	class:dark={$dark}
	class:selecting
	class:selected={!isEmpty(value)}
	class:label={ placeholder.length }
	class:error={ error.length }
	class:disabled={ disabled }
	on:mousedown={ () => selecting = !selecting }
	on:clickOutside={ () => selecting = false }
>
	<select
		bind:value
		{disabled}
		on:blur
		on:change={ () => selecting = false}
	>
		{#if list.length}
			{#each list as item}
				{#if item}
					<option value={ `${item.value}` }>{@html item.name || '' }</option>
				{:else}
					<option value></option>
				{/if}
			{/each}
		{:else}
			<slot/>
		{/if}
	</select>
	<span class="placeholder fi-lb">{@html placeholder}</span>
	<i class="icon fingger-arrow-down" />
	{#if error.length}
		<p class="message fi-lb">
			{@html error}
		</p>
	{/if}
</div>

<style lang="scss">
	select:focus {
		outline: none;
		border: none;
		box-shadow: none;
	}

	:global(option) {
		@apply bg-base-light;
	}
	:global(.dark option) {
		@apply bg-gray-700 border-none;
	}

	.wrapper {
		@apply relative min-w-12 h-12 rounded-t-lg bg-base-light border border-base-dark border-opacity-12;
		@apply transition-colors hover:bg-gray-300;

		&.dark {
			@apply border border-white border-opacity-16 bg-gray-900;
		}

		&.disabled {
			@apply pointer-events-none;
		}
		&::after {
			content: '';
			@apply block absolute -bottom-2px bg-base-dark bg-opacity-12 w-full h-2px;
		}
		&.selecting::after {
			@apply bg-primary-light;
		}
		&.error::after {
			@apply bg-error-light;
		}
		&.error.dark::after {
			@apply bg-rose-300;
		}

		& select {
			@apply mt-3px py-2 pl-4 border-none bg-base-light leading-4 text-lg bg-none bg-transparent w-full h-full;
		}
		&.label select {
			@apply pt-5 text-sm;
		}
		&:not(.label) select {
			@apply pt-2 text-base;
		}
		&.disabled select,
		&.disabled.dark select {
			@apply text-opacity-12;
		}

		& .icon {
			@apply block absolute right-2 top-3 text-2xl w-6 h-6 pointer-events-none transition-transform duration-250 transform;
		}
		&.selecting .icon {
			@apply -rotate-180;
		}
		&.selected .icon {
			@apply text-primary-light;
		}
		&.selected.dark .icon {
			@apply text-primary-dark;
		}
		&.disabled .icon {
			@apply opacity-12;
		}
		&.error .icon {
			@apply text-error-light;
		}
		&.error.dark .icon {
			@apply text-rose-300;
		}

		.placeholder {
			@apply absolute top-0 left-4 right-7 text-sm text-base-dark text-opacity-60 pointer-events-none transition duration-200 transform origin-top-left line-clamp-1;
		}
		&:not(.selected) .placeholder {
			@apply translate-y-4;
		}
		&.selected .placeholder {
			@apply translate-y-2 scale-70 text-primary-light;
		}
		&.selected.dark .placeholder {
			@apply text-primary-dark;
		}
		&.disabled .placeholder {
			@apply text-opacity-12;
		}
		&.disabled.dark .placeholder {
			@apply text-opacity-12;
		}
		&.error .placeholder {
			@apply text-error-light;
		}
		&.dark .placeholder {
			@apply text-white text-opacity-60;
		}
		&.error.dark .placeholder {
			@apply text-rose-300;
		}

		.message {
			top: 105%;
			@apply inline absolute text-error-light text-xs text-center w-full left-0;
		}
		&.error .message {
			@apply text-rose-300;
		}
	}
</style>