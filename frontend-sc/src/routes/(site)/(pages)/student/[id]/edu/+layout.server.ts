import { error } from '@sveltejs/kit';

export async function load(event) {
	const { userCanEdit } = await event.parent();

	if (!userCanEdit) {
		throw error(401, 'Unauthorized');
	}
}
