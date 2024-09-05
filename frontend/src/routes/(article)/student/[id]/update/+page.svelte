<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Heading, Hr, Alert } from 'flowbite-svelte';
	import { CloseCircleOutline } from 'flowbite-svelte-icons';

	import StudentForm from '$lib/components/student-form/StudentForm.svelte';
	import { canEditStudent } from '$lib/utils/userUtils';

	export let data;

	$: canEdit = canEditStudent(data.username, data.student);

	const { form, enhance } = superForm(data.studentForm);
</script>

<Heading tag="h3" class="page-title">Update student profile</Heading>

<Hr />

{#if canEdit}
	<div class="form-width">
		<form method="post" action="?/updateStudent" use:enhance>
			<input class="hidden" type="number" name="id" bind:value={$form.id} />
			<StudentForm {form} submitButtonText="Update" />
		</form>
	</div>
{:else}
	<Alert color="red" class="flex gap-2 max-w-prose">
		<CloseCircleOutline />
		<span>You are not authorized to access this page.</span>
	</Alert>
{/if}
