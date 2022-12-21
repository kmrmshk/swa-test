<script lang="ts">
    export let active = true;

    const classes = 'block rounded-full nogutters plain w-2 h-2 bg-base-dark dark:(bg-white bg-opacity-12) select-none focus:outline-none';
</script>

<button
    class="{classes} {$$props.class || ''}"
	class:active
    on:click
/>

<style>
    /* 押しやすくする */
    button::before {
        content: '';
        display: block;
        width: 300%;
        height: 300%;
        background-color: transparent;
        margin-top: -100%;
        margin-left: -100%;
    }

    button.active {
	    @apply bg-opacity-60;
    }
    button:not(.active) {
	    @apply bg-opacity-10;
    }
</style>