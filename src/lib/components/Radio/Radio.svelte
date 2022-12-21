<script>
	import { dark } from '$lib/stores/theme';

	export let value;
	export let group;
	export let disabled = false;

	let pressed = false;
</script>

<label class="inline-flex items-center {$$props.class || ''}">
	<input
		type="radio"
		bind:group={group}
		value={value}
		{disabled}
		on:change
		on:touchstart={() => pressed = true}
		on:touchend={() => pressed = false}
		on:mousedown={() => pressed = true}
		on:mouseup={() => pressed = false}
		class:pressed
		class:dark={ $dark }
	>
	<span class="ml-2 fi-text">
		<slot/>
	</span>
</label>

<style>
	input {
		@apply box-border relative h-5 w-5 border-2 text-gray-600 transition;
		@apply border-base-dark border-opacity-60 bg-white;
	}
	input.dark {
		@apply bg-transparent border-white border-opacity-60;
	}
	input:focus {
		@apply shadow-none outline-none;
	}
	input:checked {
		@apply border-opacity-0;
	}
	input:checked,
	input:checked:hover,
	input:checked:focus {
		@apply bg-primary-light;
	}
	input.dark:checked {
		background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='2C2C2C' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
	}
	input.dark:checked,
	input.dark:checked:hover,
	input.dark:checked:focus {
		@apply bg-primary-dark;
	}

	input::before {
		content: '';
		@apply absolute block rounded-full -mt-2px -ml-2px w-10 h-10 -left-2.5 -top-2.5 transition;
	}
	input::before {
		@apply bg-base-dark opacity-0;
	}
	input.dark::before {
		@apply bg-white opacity-0;
	}
	input.dark:checked::before {
		@apply bg-primary-dark opacity-0;
    }
	input:checked::before {
		@apply bg-primary-light opacity-0;
	}

	input:hover::before,
	input.dark:hover::before {
		@apply opacity-4;
	}
	input.pressed::before,
	input.dark.pressed::before {
		@apply opacity-10;
	}

	input:disabled {
		@apply opacity-40;
	}
</style>