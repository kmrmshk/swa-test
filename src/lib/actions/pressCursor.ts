/**
 * Touch cursor
 * @param {Element} element
 */

export default (element: Element, _options = {}) => {
	const pressClass = 'press';
	const addClass = () => element?.classList.add(pressClass);
	const removeClass = () => element?.classList.remove(pressClass);
	const option = {
		passive: true,
		capture: true,
	};
	element.addEventListener('touchstart', addClass, option);
	element.addEventListener('touchend', removeClass, option);
	element.addEventListener('mousedown', addClass, option);
	element.addEventListener('mouseup', removeClass, option);
	return {
		destroy() {
			element.removeEventListener('touchstart', addClass);
			element.removeEventListener('touchend', removeClass);
			element.removeEventListener('mousedown', addClass);
			element.removeEventListener('mouseup', removeClass);
		},
	};
};