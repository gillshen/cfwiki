const BASE = 'http://127.0.0.1:8000/api/';

export async function get(url: string) {
	const response = await fetch(`${BASE}${url}`);
	return await response.json();
}
