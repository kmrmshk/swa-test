<script lang="ts">
	import isEmpty from 'lodash/isEmpty';
	import { dark } from '$lib/stores/theme';

	export let value = '';
	export let block = false;
	export let fill = false;
	export let icon = '';
	export let readonly = false;
	export let disabled = false;
	export let placeholder = '';
	export let valid = false;
	export let error = false;
	export let errorText = '';
	export let textSize = 'sm';

	export let minRows = 1;
	export let maxRows;
	export let lineHeight = 1.4;

	$: minHeight = `${ 1 + minRows * lineHeight }em`;
	$: maxHeight = maxRows ? `${ 1 + maxRows * lineHeight }em` : `auto`;

	$: classes = [
		block ? 'flex' : 'inline-flex',
		fill ? 'w-full' : 'w-auto',
	].join(' ');

	const textFieldClasses = `text-field \
		relative items-center pl-2 min-w-60 min-h-9 rounded-lg transition \
		bg-transparent \
		dark:bg-transparent \
		hover:(bg-base-dark bg-opacity-4) \
		dark:hover:bg-transparent \
		border \
		border-base-dark border-opacity-12 \
		dark:(border-white border-opacity-38) \
		dark:hover:(hover-white border-opacity-60)`;

	const inputClasses = `absolute
		overflow-x-hidden w-full h-full max-w-full top-0 \
		max-w-full max-h-full w-full border-none outline-none border-width-0 \
		bg-transparent \
		placeholder-base-dark placeholder-opacity-60 \
		dark:(placeholder-white placeholder-opacity-60) \
		disabled:(placeholder-dark-base placeholder-opacity-38) \
		dark:disabled:(placeholder-white placeholder-opacity-38)`;

	$: iconClasses = disabled
		? `icon text-2xl text-base-dark text-opacity-38 dark:(text-white text-opacity-38)`
		: `icon text-2xl text-base-dark text-opacity-60 dark:(text-white text-opacity-60)`;
</script>
<div
	class="{ classes } { textFieldClasses } { $$props.class || '' }"
	class:disabled
	class:valid
	class:error
	class:dark={$dark}
>
	{#if !isEmpty(icon) }
		<i class="fingger-{icon} { iconClasses }"/>
	{/if}
	<div class="relative flex-grow max-w-full overflow-hidden">
		<pre
			class={ 'text-' + textSize }
			aria-hidden="true"
			style={ `min-height:${minHeight}; max-height: ${maxHeight}`}>
			{ value + '\n'}
		</pre>
		<textarea
			class="{ 'text-' + textSize } { inputClasses }"
			bind:value
			{placeholder}
			{readonly}
			{disabled}
			on:focus
			on:blur
			on:input
			on:change
			on:keypress
			on:keydown
			on:keyup></textarea>
	</div>
	{#if error && errorText.length }
		<div class="error-text">
			{ errorText }
		</div>
	{/if}
</div>

<style lang="scss">
	pre {
		visibility: hidden;
	}

	textarea {
		resize: none;
		line-break: anywhere;
	}

	textarea, pre {
		padding: 0.5em;
		background: none;
		font-family: inherit;
		border: none;
		box-sizing: border-box;
		line-height: 1.4;
		overflow-y: scroll;
	}

	textarea:focus {
		outline: none;
		border: none;
		box-shadow: none;
	}

	.text-field {
		&.disabled {
			@apply bg-base-dark bg-opacity-12;
			@apply pointer-events-none;
		}
		&.dark.disabled {
			@apply bg-white bg-opacity-8;
		}

		&.valid {
			@apply border-primary-dark dark:border-primary-light;
		}

		&.error {
			@apply border-error-light dark:border-rose-300;
			textarea {
				@apply caret-error-light dark:caret-rose-300;
			}
		}
	}

	.error-text {
		top: 100%;
		margin-top: 0.25rem;
		@apply absolute left-0 right-0 px-4 break-all text-xs text-error-light dark:text-rose-300;
	}
</style>