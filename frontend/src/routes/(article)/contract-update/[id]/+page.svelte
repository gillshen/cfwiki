<script lang="ts">
	import ContractForm from '$lib/components/contract-form/ContractForm.svelte';
	import { Heading, Hr, Input, Label } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const { form, enhance } = superForm(data.contractForm);
</script>

<Heading tag="h3" class="page-title">Update contract</Heading>

<Hr />

<div class="form-width">
	<form method="post" action="?/updateContract" use:enhance>
		<input type="number" name="id" class="hidden" bind:value={$form.id} />
		<input type="number" name="student" class="hidden" bind:value={$form.student} />

		<Label for="student-name" class="form-label">Student</Label>
		<Input id="student-name" type="text" bind:value={data.contract.student_name} disabled />

		<ContractForm {form} submitButtonText="Update" />
	</form>
</div>
