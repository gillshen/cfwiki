import { error } from '@sveltejs/kit';
import type { Writable } from 'svelte/store';

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

export const updateStore = <T extends Record<string, any>>(
	store: Writable<T>,
	key: keyof T & string,
	value: any
) => {
	store.update((data) => {
		data[key] = value;
		return data;
	});
};
