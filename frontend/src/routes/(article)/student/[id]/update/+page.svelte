<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Heading, Hr } from 'flowbite-svelte';

	import StudentForm from '$lib/components/student-form/StudentForm.svelte';

	export let data;

	const { form, enhance } = superForm(data.studentForm);
</script>

<div class="px-24 py-16 w-min">
	<Heading tag="h2" class="pt-12 px-8">Update student file</Heading>

	<Hr />

	<form method="post" action="?/updateStudent" use:enhance>
		<div class="hidden">
			<input type="number" name="id" bind:value={$form.id} />
		</div>
		<StudentForm {form} submitButtonText="Update" />
	</form>
</div>
