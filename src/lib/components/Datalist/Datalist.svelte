<script lang="ts">
	import isEmpty from 'lodash/isEmpty';
	import debounce from 'lodash/debounce';
	import clamp from 'lodash/clamp';
	import { dark } from '$lib/stores/theme';
	import clickOutside from '$lib/actions/clickOutside';
	import { createEventDispatcher } from 'svelte';

	export let placeholder = '';
	export let options = [];
	export let value = '';
	export let error = '';
	export let disabled = false;
	export let maxHeight = '200px';
	export let filtering = true;
	export let maxlength = '';

	const dispatch = createEventDispatcher();

	let wrapperElm;
	let inputElm;
	let selecting = false;
	let selectIndex = 0;

	function onClickedItem(targetItem) {
		value = targetItem.name;
		selecting = false;
		dispatch('select', targetItem);
	}

	$: filteredOptions = options.filter((item) => {
		const name = `${ item.name }`;
		selectIndex = -1;
		if(!name || !filtering) {
			return true;
		}
		return name.indexOf(value) > -1;
	});

	const onInput = debounce(() => {
		dispatch('input', value);
	}, 500, {
		leading: false,
		trailing: true
	});

	function onEnterItem(index) {
		selectIndex = index;
	}

	function onLeaveItem() {
		selectIndex = -1;
	}

	function onKeydown(e) {
		if(!selecting) {
			return;
		}
		const isArrow = ['ArrowUp', 'ArrowDown'].includes(e.key);
		switch(e.key) {
			case 'Enter':
				// IME変換確定Enterを除外する
				if(e.keyCode === 13){
					e.preventDefault();
					e.stopImmediatePropagation();
					selecting = false;
					if(selectIndex > -1) {
						onClickedItem(filteredOptions[selectIndex]);
					}
					inputElm?.blur();
				}
				break;
			case 'Escape':
				e.preventDefault();
				e.stopImmediatePropagation();
				onLeaveItem();
				selecting = false;
				inputElm?.blur();
				break;
			case 'ArrowDown':
				e.preventDefault();
				e.stopImmediatePropagation();
				selectIndex = clamp(++selectIndex, 0, filteredOptions.length - 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				e.stopImmediatePropagation();
				selectIndex = clamp(--selectIndex, 0, filteredOptions.length - 1);
				break;
			default: break;
		}

		if(isArrow && selectIndex > -1) {
			wrapperElm?.querySelector(`li[data-index="${selectIndex}"]`)
				.scrollIntoView({
					behavior: 'auto',
					block: 'nearest',
					inline: 'nearest'
				});
		}
	}
</script>

<div
	bind:this={ wrapperElm }
	class="wrapper { $$props.class || '' }"
	use:clickOutside
	class:dark={ $dark }
	class:selecting
	class:selected={ !isEmpty(value) || selecting || value }
	class:label={ placeholder.length }
	class:error={ error.length }
	class:disabled={ disabled }
	on:clickOutside
	on:clickOutside={ () => selecting = false }
>
	<input
		bind:this={ inputElm }
		bind:value={ value }
		on:focus
		on:change
		on:blur
		on:focusin={ () => selecting = true }
		on:input={ onInput }
		on:change={ onInput }
		on:keydown={ onKeydown }
		type="text"
		{maxlength}
	/>
	<span class="placeholder fi-lb">{@html placeholder}</span>
	<i class="icon fingger-arrow-down" />
	{#if error.length}
		<p class="message fi-lb">
			{@html error}
		</p>
	{/if}
	{#if selecting && filteredOptions.length}
		<div
			class="list pb-2 absolute w-full overflow-x-hidden overflow-y-scroll shadow-06dp z-2 rounded-b-lg"
			style="max-height: { maxHeight }"
		>
			<ul on:mouseleave={ onLeaveItem }>
				{#each filteredOptions as item, index}
					<li
						data-index={ index }
						class="px-4 py-2"
						class:select={ index === selectIndex }
						on:click={ () => onClickedItem(item) }
						on:mouseenter={ () => onEnterItem(index) }
					>
						<slot name="item" { item }>
							{@html item.name || '' }
						</slot>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style lang="scss">
	input:focus {
		outline: none;
		border: none;
		box-shadow: none;
	}
	input,
	input:focus,
	input:hover {
		background-image: none;
	}

	:global(.list) {
		@apply bg-base-light;
	}
	:global(.dark .list) {
		@apply bg-gray-700 border-none;
	}

	li {
		@apply transition duration-250 cursor-pointer;
	}

	li.select {
		@apply text-base-dark text-opacity-87 bg-base-dark bg-opacity-8;
	}

	.dark {
		li:focus,
		li:hover {
			@apply text-white text-opacity-87 bg-white bg-opacity-8;
		}
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

		& input {
			@apply mt-3px py-2 pl-4 border-none bg-base-light leading-4 text-lg bg-none bg-transparent w-full h-full;
		}
		&.label input {
			@apply pt-5 text-sm;
		}
		&:not(.label) input {
			@apply pt-2 text-base;
		}
		&.disabled input,
		&.disabled.dark input {
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
	}
</style>
