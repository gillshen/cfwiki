<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import Section from '$lib/components/containers/Section.svelte';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;

	const { student, enrollment } = data;
</script>

<svelte:head>
	<title
		>{createTitle(
			`${student.fullname} @ ${enrollment.school.alt_name || enrollment.school.name}`
		)}</title
	>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/student/index">Students</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/student/{student.id}">{student.fullname}</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>@ {enrollment.school.name}</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<Section id="_">
	<pre class="text-sm bg-muted p-4 rounded-lg">{JSON.stringify(data.enrollment, null, 2)}</pre>
</Section>
