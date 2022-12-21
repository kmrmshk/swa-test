<script lang="ts" context="module">
	let ref:HTMLElement;
    export const append = (el:HTMLElement) => {
		if(el && ref) {
			ref.appendChild(el);
		}
	};
	export const remove = (el:HTMLElement) => {
		if(el) {
			el.remove();
		}
	};
	export const empty =() => {
		if(ref) {
			ref.innerHTML = '';
		}
	};
</script>
<script lang="ts">
	import { dark } from '$lib/stores/theme';
	import { mobile } from '$lib/stores/device';
</script>
<div
	bind:this={ref}
	class="relative inset-0 { $$props.class || '' }"
	class:dark={ $dark }
	class:mobile={ $mobile }>
</div>