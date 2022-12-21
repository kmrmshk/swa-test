<script lang="ts">
	import Tag from '$lib/components/Tag';
	import { flip } from 'svelte/animate';

	export let selectedTags:any[]=[];

	let dragIndex = -1;
	let x = 0, y = 0;
	let startX = 0, startY = 0;
	let refs = [];
	let timeoutId = -1;

	function onMouseOut(){
		if(dragIndex > -1){
			timeoutId = setTimeout(() => {
				resetDragTag();
			}, 1000);
		}
	}

	function resetDragTag(){
		if(dragIndex > -1){
			refs[ selectedTags[dragIndex].id ].style = "";
			dragIndex = -1;
		}
	}

	function setCursorPosition(e){
		if (e.touches && e.touches[0]) {
			x = e.touches[0].clientX;
			y = e.touches[0].clientY;
		}
		else if (e.clientX && e.clientY) {
			x = e.clientX;
      y = e.clientY;
		}
	}

	function onTouchStart(index) {
		if( dragIndex == index ){
			return;
		}
		resetDragTag();
		dragIndex = index;
		const rect = refs[ selectedTags[dragIndex].id ].getBoundingClientRect();
		startX = rect.left + (rect.width/2);
		startY = rect.top + (rect.height/2);
	}

	function onTouchMove(e){
		if( dragIndex < 0 ){
			return;
		}
		clearTimeout(timeoutId);
		e.preventDefault();
		setCursorPosition(e);
		refs[ selectedTags[dragIndex].id ].style = `z-index: 1; transform: translate(${x - startX}px,${y - startY}px); opacity:60%;`;
	}

	function onTouchEnd(e){
		if( ! selectedTags[dragIndex] || ! refs[ selectedTags[dragIndex].id ]){
			return;
		}
		setCursorPosition(e);
		refs[ selectedTags[dragIndex].id ].style = "";

		const hoverIndex = selectedTags.findIndex( (tag,i) => {
			if( ! refs[ tag.id ] ){
				return false;
			}
			const rect = refs[ tag.id ].getBoundingClientRect();
			return rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom;
		});

		if( hoverIndex == dragIndex ){
			dragIndex = -1;
			return;
		}
		else if(hoverIndex > -1){
			const tmp = selectedTags[dragIndex];
			selectedTags[dragIndex] = selectedTags[hoverIndex];
			selectedTags[hoverIndex] = tmp;
		}
		else{
			const [item] = selectedTags.splice(dragIndex, 1);
			selectedTags.push(item);
		}
		selectedTags = selectedTags;
		dragIndex = -1;
	}
</script>

<div class="not-select" class:dragging={dragIndex > -1} on:blur on:mouseout={onMouseOut} on:mousemove={ onTouchMove }>
	{#each selectedTags as tag, index (tag.id)}
		<div bind:this={refs[tag.id]} class="inline-block my-1 mr-1.5 cursor-pointer relative z-0" animate:flip="{{ duration: 100 }}"
			on:mousedown={ _ => onTouchStart(index)}
			on:touchstart={ _ => onTouchStart(index)}
			on:touchmove={ onTouchMove }
			on:mouseup={ onTouchEnd }
			on:touchend={ onTouchEnd }
		>
			<Tag>{tag.name}</Tag>
		</div>
	{/each}
</div>

<style lang="scss">
	.not-select{
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	.dragging{
		@apply py-100 -my-100 relative z-10;
	}
</style>