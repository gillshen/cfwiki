const BASE = 'http://127.0.0.1:8000/api/';

export async function get(url: string) {
	const response = await fetch(`${BASE}${url}`);
	return await response.json();
}

export async function post(url: string, data: any) {
	return await fetch(`${BASE}${url}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
}

export async function patch(url: string, data: any) {
	return await fetch(`${BASE}${url}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
}

export async function createOrUpdate(data: any, url: string) {
	if (data.id) {
		return await patch(`${url}/${data.id}/update/`, data);
	} else {
		return await post(`${url}/new/`, data);
	}
}

export async function destroy(url: string) {
	return await fetch(`${BASE}${url}`, { method: 'DELETE' });
}

export function buildQuery(params?: Record<string, any>): string {
	if (!params) {
		return '';
	}

	const queryString = Object.entries(params)
		.map(([key, value]) => `${key}=${value}`)
		.join('&');

	return `?${queryString}`;
}
