import { error } from '@sveltejs/kit';

const BASE = 'http://127.0.0.1:8000/api/';

export async function get(url: string | URL, notFoundMessage?: string) {
	const response = await fetch(typeof url === 'string' ? `${BASE}${url}` : url);

	if (response.ok) {
		return await response.json();
	}

	if (response.status === 404) {
		throw error(response.status, notFoundMessage ?? 'Not found');
	} else if (response.status >= 500) {
		throw error(response.status, 'Server error');
	} else {
		throw error(response.status, 'Client error');
	}
}

export async function post(url: string, data: unknown) {
	return await fetch(`${BASE}${url}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
}

export async function patch(url: string, data: unknown) {
	return await fetch(`${BASE}${url}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
}

export async function createOrUpdate(data: { id?: number }, url: string) {
	if (data.id) {
		return await patch(`${url}/${data.id}/update/`, data);
	} else {
		return await post(`${url}/new/`, data);
	}
}

export async function destroy(url: string) {
	return await fetch(`${BASE}${url}`, { method: 'DELETE' });
}

export const makeUrl = (path: string, searchParams?: Record<string, unknown>): URL => {
	const url = new URL(`${BASE}${path}`);

	if (searchParams) {
		const searchEntries = Object.entries(searchParams)
			.filter(([, value]) => value !== undefined && value !== null)
			.map(([key, value]) => [key, String(value)]);

		url.search = new URLSearchParams(searchEntries).toString();
	}

	return url;
};
