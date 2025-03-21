import { fetchSchools } from '$lib/api/school';

export async function load(_) {
    return {
        schools: fetchSchools(),
    };
}
