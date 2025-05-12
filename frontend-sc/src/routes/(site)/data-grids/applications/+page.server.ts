import { fetchComposedApplications } from '$lib/api/application';
import { orderByLastUpdatedDesc } from '$lib/util/applicationUtils';

export async function load({ url }) {
	const cfer = url.searchParams.get('cfer');
	const application_type = url.searchParams.get('applicationType');
	const year = url.searchParams.get('year');
	const status = url.searchParams.get('status');

	return {
		applications: fetchComposedApplications({ cfer, year, application_type, status }).then((arr) =>
			arr.sort(orderByLastUpdatedDesc)
		)
	};
}
