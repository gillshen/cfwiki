<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Heading, Hr } from 'flowbite-svelte';

	import StudentForm from '$lib/components/student-form/StudentForm.svelte';

	export let data;

	const { form, enhance } = superForm(data.studentForm);
</script>

<Heading tag="h3" class="page-title">Update student information</Heading>

<Hr />

<div class="form-width">
	<form method="post" action="?/updateStudent" use:enhance>
		<input class="hidden" type="number" name="id" bind:value={$form.id} />
		<StudentForm {form} submitButtonText="Update" />
	</form>
</div>
