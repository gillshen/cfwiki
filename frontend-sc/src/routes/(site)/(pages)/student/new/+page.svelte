<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import StudentForm from '$lib/components/forms/StudentForm.svelte';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;

	const form = superForm(data.studentForm);
	const { enhance } = form;
</script>

<svelte:head>
	<title>{createTitle('Create Student Profile')}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/student/index">Students</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>New</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<h2 class="page-title mb-2">Create Student Profile</h2>

<Section id="student-form-section">
	<form
		method="POST"
		class="max-w-prose space-y-6 mt-4"
		action="?/createStudent"
		use:enhance
		id="student-form"
	>
		<StudentForm {form} />
	</form>
</Section>
