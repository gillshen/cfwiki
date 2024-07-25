<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Heading, Hr } from 'flowbite-svelte';

	import StudentForm from '$lib/components/student-form/StudentForm.svelte';

	export let data;

	const { form, enhance } = superForm(data.newStudentForm);
</script>

<div class="px-24 py-16 w-min">
	<Heading tag="h2" class="pt-12 px-8">Create a student file</Heading>

	<Hr />

	<form method="post" action="?/createStudent" use:enhance class="w-auto">
		<StudentForm {form} />
	</form>
</div>
