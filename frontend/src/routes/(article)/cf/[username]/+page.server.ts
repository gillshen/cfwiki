import { fetchUser } from '$lib/api/user';
import { fetchStudentsByUser } from '$lib/api/student';
import { fetchApplicants, fetchApplications } from '$lib/api/application';

export async function load(event) {
	const hostName = event.params.username;
	const host = await fetchUser(hostName);

	return {
		host,
		students: fetchStudentsByUser({ cfer: host.id }),
		applications: fetchApplications({ cfer: host.id }),
		applicants: fetchApplicants()
	};
}
