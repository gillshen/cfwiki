import { fetchUser } from '$lib/api/user';
import { fetchStudentsByUser } from '$lib/api/student';
import { fetchComposedApplications } from '$lib/api/application';

export async function load(event) {
	const hostName = event.params.username;
	const host = await fetchUser(hostName);

	return {
		host,
		students: fetchStudentsByUser({ cfer: host.id }),
		applications: fetchComposedApplications({ cfer: host.id })
	};
}
