<script lang="ts">
	import { dark } from '$lib/stores/theme';
</script>

<div class="app-container relative w-full h-full overflow-hidden {$dark ? 'bg-gray-900' : 'bg-base-light' }" class:dark={ $dark }>
    <slot />
</div>
