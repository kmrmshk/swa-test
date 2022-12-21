<script lang="ts">
    import isEmpty from 'lodash/isEmpty';

    export let icon = '';
    export let color = '';
    export let text = '';
    export let size = 'xl';

    const defaults = [
        'inline-flex',
        'items-center',
        'rounded-full',
        'leading-6',
        'text-xs',
        'font-light',
        'h-6',
        'rounded-xl',
    ];

    function space() {
        if(isEmpty(icon)) {
            return ['px-3'];
        } else {
            return ['pl-1', 'pr-3'];
        }
    }

    function bg() {
        if(isEmpty(color)) {
            return ['bg-chip-default'];
        }
        return [`bg-${color}`];
    }

    function fg() {
        if(isEmpty(text)) {
            return ['text-base-dark'];
        }
        return [`text-${text}`];
    }

    $: classes = [
        ...defaults,
        ...space(),
        ...bg(),
        ...fg()
    ].join(' ');
</script>

<span class="{classes} {$$props.class || ''}">
    {#if !isEmpty(icon) }
        <i class="icon {`text-${size}`} fingger-{icon} {!isEmpty(text) ? fg() : ''}" />
    {/if}
    <slot />
</span>