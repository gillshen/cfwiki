import {fetchPrograms} from '$lib/api/program'

export async function load(_) {
    return {
        programs: fetchPrograms()
    };
}
