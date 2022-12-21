import Tooltip from '$lib/components/Tooltip';

type Offset = {
	x?: number,
	y?: number
};

type TooltipOption = {
    label: string,
    position: 'center'|'top'|'left'|'right'|'bottom'|'sticky',
	offset?: Offset,
	autohide?: number,
	customClass?: string
};

const invalidOffset = -1024;

export function tooltip(element:HTMLElement, option:TooltipOption) {
	let tooltip:Tooltip;
	let timeoutId:number;

	function getX(base:DOMRect, child:DOMRect) {
		let x = 0;
		let o = option.offset?.x ?? 0;
		switch(option.position) {
			case 'right':
				x = base.right;
				break;
			case 'left':
				x = Math.max(0, base.left - child.width);
				break;
			default:
				x = Math.max(0, base.left + (base.width / 2) - (child.width / 2));
				break;
		}
		return Math.max(0, x) + o;
	}

	function getY(base:DOMRect, child:DOMRect) {
		let y = 0;
		let o = option.offset?.y ?? 0;
		switch(option.position) {
			case 'bottom':
				y = base.bottom;
				break;
			case 'top':
				y = Math.max(0, base.top - child.height);
				break;
			default:
				y = Math.max(0, base.top + (base.height / 2) - (child.height / 2));
				break;
		}
		return Math.max(0, y) + o;
	}

	function onPointerEnter(event:any) {
		if(option.position === 'sticky') {
			tooltip = new Tooltip({
				props: {
					label: option.label,
					x: event.pageX,
					y: event.pageY,
					customClass: option.customClass
				},
				target: document.body
			});
		} else {
			tooltip = new Tooltip({
				props: {
					label: option.label,
					x: invalidOffset,
					y: invalidOffset,
					customClass: option.customClass
				},
				target: document.body
			});
			const base = element.getBoundingClientRect();
			const child = tooltip.getBoundingClientRect();
			tooltip.$set({
				x: getX(base, child),
				y: getY(base, child)
			});
		}
		window.clearTimeout(timeoutId);
		if(option.autohide) {
			timeoutId = window.setTimeout(onPointerEnd, option.autohide);
		}
	}

	function onPointerMove(event:any) {
		tooltip?.$set({
			x: event.pageX + (option.offset?.x ?? 0),
			y: event.pageY + (option.offset?.y ?? 0),
		});
	}

	function onPointerEnd() {
		tooltip?.$destroy();
	}

	element.addEventListener('pointerenter', onPointerEnter);
	element.addEventListener('pointerleave', onPointerEnd);
	element.addEventListener('pointercancel', onPointerEnd);

	if(option.position === 'sticky') {
		element.addEventListener('pointermove', onPointerMove);
	}

	return {
		destroy() {
			element.removeEventListener('pointerenter', onPointerEnter);
			element.removeEventListener('pointerleave', onPointerEnd);
			element.removeEventListener('pointercancel', onPointerEnd);
			element.removeEventListener('pointermove', onPointerMove);
		}
	}
}

export default tooltip;