import { redirect } from '@sveltejs/kit';

import { fetchUser } from '$lib/api/user';
import { fetchStudentsByUser } from '$lib/api/student';
import { fetchApplicants, fetchApplications } from '$lib/api/application';

export async function load(event) {
	const hostName = event.params.username;
	try {
		const host = await fetchUser(hostName);
		return {
			host,
			students: fetchStudentsByUser({ cfer: host.id }),
			applications: fetchApplications({ cfer: host.id }),
			applicants: fetchApplicants()
		};
	} catch (err) {
		redirect(303, '/cf/404');
	}
}
