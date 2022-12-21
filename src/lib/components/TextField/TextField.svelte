<script lang="ts">
	import isEmpty from 'lodash/isEmpty';
	import { dark } from '$lib/stores/theme';
	import { mobile } from '$lib/stores/device';

	export let value = '';
	export let block = false;
	export let fill = false;
	export let icon = '';
	export let input:HTMLElement|null = null;
	export let readonly = false;
	export let disabled = false;
	export let placeholder = '';
	export let password = false;
	export let valid = false;
	export let error = false;
	export let errorText = '';
	export let autocomplete = false;
	export let prefix = false;
	export let inputClass = '';
	export let maxlength = 524288;

	$: classes = [
		block ? 'flex' : 'inline-flex',
		fill ? 'w-full' : 'w-auto',
		'relative',
	].join(' ');

	const wrapperDefaultClass = 'items-center h-9 rounded-lg transition bg-transparent dark:bg-transparent hover:(bg-base-dark bg-opacity-4) dark:hover:bg-transparent border border-base-dark border-opacity-12 dark:(border-white border-opacity-38) dark:hover:(hover-white border-opacity-60)';
	const inputDefaultClass = 'w-full h-full border-none outline-none border-width-0 bg-transparent placeholder-base-dark placeholder-opacity-60 dark:(placeholder-white placeholder-opacity-60) disabled:(placeholder-dark-base placeholder-opacity-38) dark:disabled:(placeholder-white placeholder-opacity-38)';

	$: textSizeClass = $mobile ? 'text-base' : 'text-sm';
	$: iconClasses = disabled
		? `icon text-2xl text-base-dark text-opacity-38 dark:(text-white text-opacity-38)`
		: `icon text-2xl text-base-dark text-opacity-60 dark:(text-white text-opacity-60)`;
</script>
<div
	class="text-field { classes } { wrapperDefaultClass } { $$props.class || '' }"
	class:dark={ $dark }
	class:disabled
	class:valid
	class:error
>
	{#if prefix}
		<div class="flex items-center relative px-3 -left-0.25 h-9 rounded-l-lg border-1 text-center text-sm border-base-dark border-opacity-12 text-base-dark text-opacity-38 bg-base-dark bg-opacity-12 dark:(border-white border-opacity-12 text-white text-opacity-38 bg-white bg-opacity-12)">
			<slot name="prefix" />
		</div>
	{/if}
	{#if !isEmpty(icon) }
		<i class="pl-2 fingger-{icon} { iconClasses }" />
	{/if}
	{#if password}
		<input
			bind:this={input}
			class="{ inputDefaultClass } { textSizeClass } { inputClass }"
			type="password"
			bind:value
			{autocomplete}
			{placeholder}
			{readonly}
			{disabled}
			{maxlength}
			on:focus
			on:blur
			on:input
			on:change
			on:keypress
			on:keydown
			on:keyup
		/>
	{:else}
		<input
			bind:this={input}
			class="{ inputDefaultClass } { textSizeClass } { inputClass }"
			type="text"
			bind:value
			{autocomplete}
			{placeholder}
			{readonly}
			{disabled}
			{maxlength}
			on:focus
			on:blur
			on:input
			on:change
			on:keypress
			on:keydown
			on:keyup
		/>
	{/if}
	{#if error && errorText.length }
		<div class="error-text">
			{ errorText }
		</div>
	{/if}
</div>

<style lang="scss">
	input:focus {
		outline: none;
		border: none;
		box-shadow: none;
	}
	.text-field {
		&.disabled {
			@apply bg-base-dark bg-opacity-12;
			@apply pointer-events-none;
		}
		&.valid {
			@apply border-primary-dark;
		}
		&.error {
			@apply border-error-light;
				input {
					@apply caret-red-500;
				}
		}
	}
	.text-field.dark {
		&.disabled {
			@apply bg-white bg-opacity-8;
		}
		&.valid {
			@apply border-primary-light;
		}
		&.error {
			@apply border-rose-300;
				input {
					@apply caret-red-200;
				}
		}
	}

	.error-text {
		top: 100%;
		margin-top: 0.25rem;
		@apply absolute left-0 right-0 px-4 whitespace-nowrap text-xs text-error-light dark:text-rose-300;
	}
</style>