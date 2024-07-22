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
