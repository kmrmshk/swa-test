<script>
    export let style = null;
    export let inline = false;
    export let vertical = true;
    export let rounded = "2.5xl";
    const classes = 'relative bg-clip-border';
</script>

<div on:click on:mouseenter on:mouseleave class="{inline ? 'inline-flex' : 'flex w-full'} { `rounded-${rounded}` } {vertical ? 'flex-col' : 'flex-row'} {classes} {$$props.class || ''}" {style} >
    <slot/>
</div>