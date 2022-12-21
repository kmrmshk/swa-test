/**
 * Click Outside
 * @param {Node} node
 */
 export default (node:Node, _options = {}) => {
	const options = {
		include: [],
		..._options
	};
	function detect(e:MouseEvent) {
		const target = e.target as Node;
		if (!node.contains(target) || options.include.some((i) => target.isSameNode(i))) {
			node.dispatchEvent(new CustomEvent('clickOutside'));
		}
	}
	document.addEventListener('click', detect, {
		passive: true,
		capture: true
	});
	return {
		destroy() {
			document.removeEventListener('click', detect);
		},
	};
};