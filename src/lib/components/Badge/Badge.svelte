<script lang="ts">
    export let top = true;
    export let right = true;
    export let bottom = false;
    export let left = false;

    const base = 'absolute w-3 h-3 bg-notice-default dark:bg-rose-300 rounded-full';

	$: posY = top ? 'top-1' : (bottom ? 'bottom-1' : '');
	$: posX = right ? 'right-1' : (left ? 'left-1' : '');
</script>

<span class="{ base } { posX } { posY } { $$props.class || '' }"></span>