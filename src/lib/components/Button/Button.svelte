<script lang="ts">
    import { dark } from '$lib/stores/theme';
    import { goto } from '$app/navigation';
    import isEmpty from 'lodash/isEmpty';
    import Loading from '$lib/components/Loading';
    import colors from '$lib/styles/colors';
    import tooltipTrigger from '$lib/actions/tooltipTrigger';

    export let to = '';
    // positions
    export let absolute = false;
    export let fixed = false;
    // styles
    export let text = false;
    export let outlined = false;
    export let plain = false;
    export let nogutters = false;
    export let rounded = 'xl';
    // font-size
    export let small = false;
    export let large = false;
    // disabled
    export let disabled = false;
    export let loading = false;
    export let tooltip = {};

    const white = '#FFFFFF';

    let pressed = false;
    let action:Function;

    $: svgColor = $dark
        ? (text ? white : colors.gray[600])
        : (text ? colors.primary.light : white);
    $: svgSize = large ? 25 : (small ? 17 : 20);
    $: if(disabled) {
        pressed = false;
    }
    $: action = isEmpty(tooltip) ? () => {} : tooltipTrigger;

    function space() {
        if (nogutters) {
            return 'p-0';
        }
        else {
            return 'px-3 md:px-5 py-2';
        }
    }

    function font() {
        switch (true) {
            case small:
                return 'text-xs'
            case large:
                return 'text-lg font-light'
            default:
                return 'text-sm font-thin'
        }
    }

    function position() {
        switch (true) {
            case absolute:
                return 'absolute'
            case fixed:
                return 'fixed'
            default:
                return 'relative'
        }
    }

    function onClick() {
        if (isEmpty(to)) {
            return;
        }
        goto(to);
    }

</script>
<button
    {disabled}
    class="{ space() } { position() } { font() } {`rounded-${rounded}`} {$$props.class || ''}"
    class:dark={ $dark }
    class:text={ text }
    class:plain={ plain }
    class:normal={ !text && !plain }
    class:outlined={ outlined }
    class:disabled={ disabled }
    class:pressed
    on:touchstart={ () => pressed = true }
    on:touchend={ () => pressed = false }
    on:mousedown={ () => pressed = true }
    on:mouseup={ () => pressed = false }
    on:mouseleave={ () => pressed = false }
    on:click={onClick}
    on:click
    on:mouseover
    on:focus
    type="button"
    use:action={ tooltip }
>
    <div class="relative">
        {#if loading}
            <div class="inline-flex justify-center items-center absolute inset-0">
                <Loading fill="{svgColor}" size="{svgSize}" />
            </div>
        {/if}
        <div class="flex content-center justify-center items-center h-full w-full {loading ? 'invisible' : ''}">
            <slot/>
        </div>
    </div>
</button>

<style lang="scss">
    button::before {
        content: '';
        @apply absolute top-0 -bottom-1 left-0 right-0 pointer-events-none transition-colors box-border;
    }
    button[disabled], button > * {
        @apply pointer-events-none;
    }

    button {
        @apply box-border select-none transition duration-300 overflow-hidden font-bold;
    }
    button:focus {
        @apply outline-none;
    }

    button.outlined {
        --tw-shadow-color: 26, 32, 46;
        --tw-shadow: 0 0 0 1px rgba(var(--tw-shadow-color), 0.12);
        -webkit-box-shadow: var(--tw-shadow);
        box-shadow: var(--tw-shadow);
    }
    button.outlined.dark {
        --tw-shadow-color: 240, 242, 245;
        --tw-shadow: 0 0 0 1px rgba(var(--tw-shadow-color), 0.12);
        -webkit-box-shadow: var(--tw-shadow);
        box-shadow: var(--tw-shadow);
    }

    button.plain {
        @apply text-base-dark text-opacity-87 bg-primary-light bg-opacity-0;
        &:disabled {
            @apply opacity-38;
        }
        &:hover {
            @apply bg-primary-light bg-opacity-4;
        }
        &.pressed {
            @apply bg-primary-light bg-opacity-12;
        }
    }

    button.text {
        @apply text-primary-light bg-transparent;
        &:disabled {
            @apply bg-transparent text-base-dark text-opacity-40;
        }
        &:active {
            @apply bg-primary-light bg-opacity-12;
        }
        &:hover {
            @apply bg-primary-light bg-opacity-4;
        }
        &.pressed {
            @apply bg-primary-light bg-opacity-12;
        }
    }

    button.normal {
        @apply text-white bg-primary-light;
        &:active::before {
            @apply bg-white bg-opacity-60;
        }
        &:disabled {
            @apply bg-base-dark bg-opacity-12;
        }
        &:hover::before {
            @apply bg-white bg-opacity-38;
        }
        &.pressed::before {
            @apply bg-white bg-opacity-60;
        }
    }

    :global(.dark) button:not(.dark), button.dark {
        &.plain {
            @apply text-base-light text-opacity-87 bg-primary-dark bg-opacity-0;
            &:hover {
                @apply bg-primary-dark bg-opacity-4;
            }
            &.pressed {
                @apply bg-primary-dark bg-opacity-12;
            }
        }
        &.text {
            @apply text-base-light text-opacity-87;
            &:disabled {
                @apply text-white text-opacity-38;
            }
            &:active {
                @apply bg-primary-dark bg-opacity-12;
            }
            &:hover {
                @apply bg-primary-dark bg-opacity-8;
            }
            &.pressed {
                @apply bg-primary-dark bg-opacity-12;
            }
        }

        &.normal {
            @apply text-gray-900 bg-primary-dark;
            &:active::before {
                @apply bg-white bg-opacity-12;
            }
            &:disabled {
                @apply bg-white bg-opacity-4 text-white text-opacity-38;
            }
            &:hover::before {
                @apply bg-white bg-opacity-4;
            }
            &.pressed::before {
                @apply bg-white bg-opacity-12;
            }
        }
    }
</style>