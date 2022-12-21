import { now } from 'svelte/internal';
import { quintInOut } from 'svelte/easing';

export interface DefaultOptions {
	offset?: number
	duration?: number
	easing?: (t: number) => number,
	onComplete?: () => void
}

export interface SmoothOptions extends DefaultOptions {
	start: number
	end: number
}

const defaults = <DefaultOptions>{
	offset: 0,
	duration: 250,
	easing: quintInOut
};

const currentPosition = (
	start: number,
	end: number,
	elapsed: number,
	duration: number,
	easing: (t: number) => number,
): number => {
	if (elapsed > duration) {
		return end
	}
	return start + (end - start) * easing(elapsed / duration);
};

const smoothScroll = (
	options: SmoothOptions,
	callback: (position: number, result: boolean) => void,
): AbortController => {
	const controller = new AbortController();
	const { signal } = controller;
	const { start, end, duration, easing, onComplete } = options;
	const clock = now();

	let id = 0;

	function onAbort() {
		signal.removeEventListener('abort', onAbort);
		window.cancelAnimationFrame(id);
	}

	function step() {
		const elapsed = now() - clock;
		const position = currentPosition(start, end, elapsed, duration, easing);
		const result = elapsed > duration;
		callback(position, result);
		switch(true) {
			case result:
				onComplete && onComplete();
			case signal.aborted: {
				signal.removeEventListener('abort', onAbort);
				return;
			}
		}
		window.requestAnimationFrame(step);
	}
	id = window.requestAnimationFrame(step);
	signal.addEventListener('abort', onAbort);

	return controller;
};

const doScroll = (
	target: HTMLElement,
	endPosition: number,
	opts?: DefaultOptions,
): AbortController => {
	const options = {...defaults, ...opts};
	const start = target?.scrollTop;
	const end = endPosition + options.offset;
	return smoothScroll({ ...options, start, end }, (position: number) => target.scrollTop = position);
};

export const scroll = (
	target: HTMLElement,
	endPosition: number,
	options?: DefaultOptions
): AbortController => doScroll(target, endPosition, options);

export const scrollTop = (
	target: HTMLElement,
	options?: DefaultOptions
): AbortController => doScroll(target, 0, options);

export const scrollBottom = (
	target: HTMLElement,
	options?: DefaultOptions
): AbortController => doScroll(target, target.scrollHeight - target.offsetHeight, options);