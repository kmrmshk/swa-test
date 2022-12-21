<script lang="ts">
	import { dark } from '$lib/stores/theme';

	export let checked = false;
	export let disabled = false;
	export let readOnly = false;

	let pressed = false;

</script>

<label class="switch inline-flex items-center cursor-pointer {$$props.class || ''}">
	<div class="relative transition {disabled ? 'opacity-40' : 'opacity-100'}"
		on:change
		on:click
		on:touchstart={() => pressed = true}
		on:touchend={() => pressed = false}
		on:mousedown={() => pressed = true}
		on:mouseup={() => pressed = false} >
  		<input type="checkbox" class="sr-only" class:dark={$dark} bind:checked={ checked } disabled={disabled||readOnly} />
		<div class="rail"></div>
		<div class="dot "
			class:pressed></div>
	</div>
</label>

<style>
	input ~ .dot {
		@apply absolute w-5 h-5 rounded-full shadow-02dp -left-0.75 -top-0.75 transition;
		@apply bg-white;
	}
	input ~ .rail {
		@apply relative w-8.5 h-3.5 rounded-full shadow-inner;
		@apply bg-gray-400;
	}
	input:checked ~ .dot:disabled {
		@apply bg-gray-400 opacity-40;
	}
	input:checked ~ .rail::before {
		@apply bg-primary-light opacity-40;
	}
	input:checked ~ .dot {
		@apply transform translate-x-full bg-primary-light;
	}
	input:checked ~ .rail {
		@apply bg-primary-light bg-opacity-38;
	}

	input.dark ~ .dot {
		@apply bg-gray-800;
	}
	input.dark ~ .rail {
		@apply bg-gray-800;
	}
	input.dark ~ .rail::before {
		content: '';
		@apply absolute inset-0 rounded-full bg-white opacity-38;
	}
	input.dark:checked ~ .rail::before {
		@apply bg-primary-dark opacity-38;
	}
	input.dark ~ .dot::before {
		content: '';
		@apply absolute inset-y-0 left-0 w-5 rounded-full bg-white opacity-60;
	}
	input.dark:checked ~ .dot::before {
		@apply transform bg-primary-dark opacity-100;
	}

	input ~ .dot::after {
		content: '';
		@apply absolute block rounded-full w-10 h-10 -left-2.5 -top-2.5 transition;
	}
	input ~ .dot::after {
		@apply bg-base-dark opacity-0;
	}
	input.dark ~ .dot::after {
		@apply bg-white opacity-0;
	}
	input:checked ~ .dot::after {
		@apply bg-primary-light opacity-0;
	}
	input.dark:checked ~ .dot::after {
		@apply bg-primary-dark opacity-0;
	}

	input ~ .dot:hover::after,
	input.dark ~ .dot:hover::after {
		@apply opacity-4;
	}
	input ~ .dot.pressed::after,
	input.dark ~ .dot.pressed::after {
		@apply opacity-10;
	}

</style>