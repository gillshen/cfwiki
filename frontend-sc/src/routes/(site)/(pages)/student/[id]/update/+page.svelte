<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import FormButton from '$lib/components/ui/form/form-button.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as StudentPage from '$lib/components/widgets/student-page/index';
	import StudentForm from '$lib/components/forms/StudentForm.svelte';

	export let data;

	const form = superForm(data.form, { resetForm: false, invalidateAll: 'force' });
	const { enhance } = form;
</script>

<StudentPage.Layout>
	<svelte:fragment slot="breadcrumb">
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/student/{data.student.id}">{data.student.fullname}</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page>Update</Breadcrumb.Page>
		</Breadcrumb.Item>
	</svelte:fragment>

	<StudentPage.Header student={data.student} slot="header" />

	<StudentPage.Bio student={data.student} slot="aside" />

	<h3 class="pb-2 pt-[72px] px-6 text-sm text-muted-foreground">Update Profile</h3>

	<section class="border rounded-xl px-12 py-4 bg-white max-w-prose w-fit">
		<form
			method="POST"
			class="max-w-prose space-y-6 my-4"
			action="?/updateStudent"
			use:enhance
			id="student-form"
		>
			<StudentForm {form} />
			<FormButton>Save Changes</FormButton>
		</form>
	</section>
</StudentPage.Layout>
