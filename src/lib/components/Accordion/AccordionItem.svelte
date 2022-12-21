<script>
    export let id = "item" + Math.random().toString(36);
    export let title = "Title";
    export let expanded = false;
    export let disabled = false;
    export let ref = null;

    import { slide } from 'svelte/transition';
    import { getContext, onDestroy } from 'svelte';

    const ctx = getContext("Accordion");

    let unsubscribe = undefined;

    onDestroy(() => {
        if (ctx){
            ctx.remove({ id });
        }
        if (unsubscribe){
            unsubscribe();
        }
    });

    $: buttonId = `button-${id}`;
    $: if (ctx) {
        ctx.add({ id, expanded });
        unsubscribe = ctx.items.subscribe((value) => {
            expanded = value[id];
        });
    }
</script>

<li data-accordion-item {...$$restProps}>
    <div
        class="box-border select-none focus:outline-none"
        bind:this={ref}
        aria-expanded={expanded}
        aria-controls={id}
        aria-disabled={disabled}
        {disabled}
        id={buttonId}
        on:click
        on:click={() => {
            if (ctx) {
                ctx.toggle({ id, expanded: !expanded });
                if (expanded && ref.getBoundingClientRect().top < 0){
                    ref.scrollIntoView();
                }
            }
        }}>
        <slot {expanded} name="title">{title}</slot>
    </div>
    {#if expanded}
        <div role="region" {id} aria-labelledby={buttonId} transition:slide|local>
            <slot />
        </div>
    {/if}
</li>