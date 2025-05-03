<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import SchoolForm from '$lib/components/forms/SchoolForm.svelte';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;

	const form = superForm(data.form);
	const { enhance } = form;
</script>

<svelte:head>
	<title>{createTitle(`${data.school.name} | Update`)}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/school/index">Schools</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/school/{data.school.id}"
			>{data.school.alt_name || data.school.name}</Breadcrumb.Link
		>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>Update</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<h1 class="page-title mb-2">Update School Profile</h1>

<Section id="school-form-section">
	<form
		method="POST"
		class="max-w-prose space-y-6 mt-4"
		action="?/updateSchool"
		use:enhance
		id="school-form"
	>
		<SchoolForm {form} hideSchoolType />
	</form>
</Section>
