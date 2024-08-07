<script lang="ts">
	import { goto } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms';
	import { Card, Button, Heading, Hr, Dropdown } from 'flowbite-svelte';
	import { ChevronRightOutline } from 'flowbite-svelte-icons';

	import StudentInfobox from '$lib/components/infobox/StudentInfobox.svelte';
	import DropdownActionItem from '$lib/components/list-items/DropdownActionItem.svelte';
	import ContractForm from '$lib/components/contract-form/ContractForm.svelte';
	export let data;

	const { form, enhance } = superForm(data.newContractForm);

	$: canEdit = true;
</script>

<Heading tag="h1" class="alt-page-title">{data.student.fullname}</Heading>

<Hr />

<div class="w-[36rem] min-w-[32rem] pb-8">
	<StudentInfobox student={data.student} />

	{#if canEdit}
		<div class="flex gap-x-8 mt-8">
			<Button outline>Actions<ChevronRightOutline class="w-6 h-6 ms-1" /></Button>
			<Dropdown class="w-40 z-20" placement="right-start">
				<DropdownActionItem text="Update" onClick={() => goto(`${data.student.id}/update`)} />
				<DropdownActionItem text="Delete" onClick={() => alert('delete student file')} dark />
			</Dropdown>
		</div>
	{/if}
</div>

<div class="flex gap-8">
	{#each data.student.contracts_sorted as contract}
		<Card size="xs">
			<div class="text-sm bg-gray-200">
				<pre>{JSON.stringify(contract, null, 1)}</pre>
			</div>
			<div class="flex justify-center mt-4 space-x-3">
				<Button outline href={`/contract-update/${contract.id}`}>Update</Button>
				<Button color="light" class="dark:text-white" disabled>Delete</Button>
			</div>
		</Card>
	{/each}
</div>

<div class="form-width pt-8">
	<form method="post" action="?/createContract" use:enhance>
		<input class="hidden" type="number" name="student" bind:value={data.student.id} />
		<ContractForm {form} />
	</form>
</div>

<Hr />

<Button href={`/student/${data.student.id}/new-application`}>New application</Button>
