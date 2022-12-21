<script lang="ts">
	import Image from '$lib/components/Image';

	export let thumbnail:string = '';
	export let altImage:string = '/assets/images/icons/avatar.svg';
	export let size:string|number|boolean = 48;
	export let rounded:string = '4xl';

	$: width = size ? size : 'auto';
</script>

<div
	class="inline-block flex-shrink-0 overflow-hidden { `rounded-${rounded}` } {$$props.class || ''}"
	style={(size > 0 ? `width: ${size}px; height: ${size}px;` : '') + `${$$props.style || ''}`}
	on:click|stopPropagation >
	<Image
		class="pointer-events-none"
		aux={ altImage }
		src={ thumbnail }
		width="100%"
		height="100%"
	/>
</div>