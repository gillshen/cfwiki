<script lang="ts">
	import ContractForm from '$lib/components/contract-form/ContractForm.svelte';
	import { Heading, Hr, Input, Label } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const { form, enhance } = superForm(data.contractForm);
</script>

<div class="px-24 py-16 w-min">
	<Heading tag="h2" class="pt-12 px-8">Update contract</Heading>

	<Hr />

	<form method="post" action="?/updateContract" use:enhance>
		<input type="number" name="id" class="hidden" bind:value={$form.id} />
		<input type="number" name="student" class="hidden" bind:value={$form.student} />

		<div class="w-[30rem] px-8">
			<Label for="student-name" class="form-label">Student</Label>
			<Input id="student-name" type="text" bind:value={data.contract.student_name} readonly />
		</div>

		<ContractForm {form} submitButtonText="Update" />
	</form>
</div>
