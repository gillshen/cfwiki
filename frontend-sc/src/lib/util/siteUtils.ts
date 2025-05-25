import { error } from '@sveltejs/kit';

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export const scrollToHash = () => {
	const hash = window.location.hash;
	if (hash) {
		setTimeout(() => {
			const target = document.querySelector(hash);
			target?.scrollIntoView({ behavior: 'smooth' });
		}, 100); // Small delay to ensure DOM is ready
	}
};

export const base10Or400 = (input: string | null | undefined, errorMessage: string): number => {
	const result = parseInt(input ?? '', 10);
	if (isNaN(result)) {
		throw error(400, errorMessage);
	}
	return result;
};

export const createTitle = (title: string) => `CF | ${title}`;
