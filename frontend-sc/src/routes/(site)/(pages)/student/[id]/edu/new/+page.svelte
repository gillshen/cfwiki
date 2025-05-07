<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import NewEnrollmentForm from '$lib/components/forms/enrollment-form/NewEnrollmentForm.svelte';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;
</script>

<svelte:head>
	<title>{createTitle(`${data.student.fullname} | Create Educational Experience`)}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/student/index">Students</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/student/{data.student.id}">{data.student.fullname}</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>New Educational Experience</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<h1 class="page-title mb-2">Create Educational Experience</h1>

{#await data.schools}
	<LoadingSign />
{:then schools}
	<Section id="enrollment-form-section">
		<NewEnrollmentForm
			data={data.newEnrollmentForm}
			studentId={data.student.id}
			{schools}
			newSchoolForm={data.newSchoolForm}
			class="ml-0"
			onUpdated={() => console.log('success')}
		/>
	</Section>
{/await}
