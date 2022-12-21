export default (node: Element, options: IntersectionObserverInit) => {
	const settings = {
		once: false,
		...options
	};

	const observer = new IntersectionObserver((entries) => {
		const entry = entries[0];
		const intersecting = entry.isIntersecting;
		if (intersecting) {
			node.dispatchEvent(new CustomEvent('intersect', {
				detail: entry,
			}));
			if (settings.once) {
				observer.unobserve(node);
			}
		}
		node.dispatchEvent(new CustomEvent('update', {
			detail: intersecting,
		}));
	}, settings);

	observer.observe(node);

	return {
		destroy() {
			observer.unobserve(node);
		},
	};
};