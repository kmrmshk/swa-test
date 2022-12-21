<script>
	import { dark } from '$lib/stores/theme';

	export let value = null;
	export let checked = false;
	export let disabled = false;

	let pressed = false;
</script>

<label class="inline-flex items-center { $$props.class || '' }">
	<input type="checkbox"
		bind:checked={ checked }
		{ value }
   		{ disabled }
		on:change
		on:touchstart={ () => pressed = true }
		on:touchend={ () => pressed = false }
		on:mousedown={ () => pressed = true }
		on:mouseup={ () => pressed = false }
		class:dark={ $dark }
		class:light={ !$dark }
		class:pressed
	>
	<span class="ml-2 fi-text">
		<slot/>
	</span>
</label>

<style>
	input {
		@apply relative h-5 w-5 text-gray-600 transition border-2 rounded-lg;
	}
	input.dark {
		@apply bg-transparent border-white border-opacity-60;
	}
	input:focus {
		box-shadow: none;
		outline: none;
	}
	input:disabled {
		@apply opacity-40;
	}

	input:checked {
		@apply bg-none;
	}
	input:checked,
	input:checked:focus,
	input:checked:hover {
		@apply bg-primary-light border-opacity-0;
	}
	input.dark:checked,
	input.dark:checked:focus,
	input.dark:checked:hover {
		@apply bg-primary-dark border-opacity-0;
	}

	input::before {
		@apply absolute block rounded-full -mt-2px -ml-2px w-10 h-10 -left-2.5 -top-2.5 transition;
		@apply bg-base-dark opacity-0;
		content: '';
	}
	input.dark::before {
		@apply bg-white opacity-0;
	}

	input:hover::before,
	input.dark:hover::before {
		@apply opacity-4;
	}
	input:checked::before {
		@apply bg-primary-light opacity-0 border-opacity-0;
    }
	input.dark:checked::before {
		@apply bg-primary-dark opacity-0 border-opacity-0;
    }
	input:checked:hover::before,
	input.dark:checked:hover::before {
		@apply opacity-4;
    }
	input.pressed:hover::before {
		@apply opacity-10;
	}
	input.dark.pressed:hover::before {
		@apply opacity-12;
    }

	input:checked::after {
		font-family: 'fingger';
		content: '\e900';
		@apply absolute inline-flex justify-center content-center inset-x-0 bottom-0 h-14px text-xxs pointer-events-none;
	}
	input.light:checked::after {
        @apply text-white;
    }
	input.dark:checked::after {
		@apply text-gray-700;
	}
</style>