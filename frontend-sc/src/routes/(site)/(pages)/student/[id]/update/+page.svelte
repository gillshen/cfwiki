<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import StudentForm from '$lib/components/forms/StudentForm.svelte';

	export let data;

	const form = superForm(data.form);
	const { enhance } = form;
</script>

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
		<Breadcrumb.Page>Update</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<h2 class="page-title mb-2">Update Student Profile</h2>

<Section id="student-form-section">
	<form
		method="POST"
		class="max-w-prose space-y-6 mt-4"
		action="?/updateStudent"
		use:enhance
		id="student-form"
	>
		<StudentForm {form} />
	</form>
</Section>
