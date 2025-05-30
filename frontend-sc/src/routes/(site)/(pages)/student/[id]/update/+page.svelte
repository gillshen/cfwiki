<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as StudentPage from '$lib/components/widgets/student-page/index';
	import StudentForm from '$lib/components/forms/StudentForm.svelte';

	export let data;

	const form = superForm(data.form);
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
		</form>
	</section>
</StudentPage.Layout>
