import { fetchUser } from '$lib/api/user';
import { fetchStudentsByUser } from '$lib/api/student';
import { fetchComposedApplications } from '$lib/api/application';

export async function load(event) {
	const host = await fetchUser(event.params.username);
	return {
		host,
		hostStudents: fetchStudentsByUser({ cfer: host.username }),
		hostApplications: fetchComposedApplications({ cfer: host.username })
	};
}
