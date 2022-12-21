<script lang="ts">
    export let navi = false;
    export let lg = false;
    export let disabled = false;
    $: md = !lg;
</script>

<li class="flex items-center min-h-12 transition focus:(bg-base-dark bg-opacity-10) hover:(bg-base-dark bg-opacity-10) dark:focus:(bg-white bg-opacity-8) dark:hover:(bg-white bg-opacity-8) { md ? 'min-w-60' : 'min-w-70' } { disabled ? 'opacity-25 pointer-events-none' : 'cursor-pointer' } { $$props.class || '' }"
    on:click>
    {#if $$slots.icon}
        <div class="text-2xl fi-text">
            <slot name="icon"></slot>
        </div>
    {/if}
    <div class="pl-5 text-base flex-grow fi-text">
        <slot/>
    </div>
    {#if navi}
        <div class="inline-flex text-2xl font-light">
            <slot name="navi">
                <i class="icon fingger-arrow-right" />
            </slot>
        </div>
    {/if}
</li>