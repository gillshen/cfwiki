<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Button } from 'flowbite-svelte';

	import type { StudentDetail } from '$lib/api/student';
	import type { Contract } from '$lib/api/contract';
	import ContractItem from '$lib/components/list-items/ContractItem.svelte';
	import AddButton from '$lib/components/buttons/AddButton.svelte';
	import UpdateButton from '$lib/components/buttons/UpdateButton.svelte';
	import DeleteButton from '$lib/components/buttons/DeleteButton.svelte';
	import GotoButton from '$lib/components/buttons/GotoButton.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import ContractForm from '$lib/components/contract-form/ContractForm.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import { canEditContract, canEditStudent } from '$lib/utils/userUtils';

	export let student: StudentDetail;
	export let username: string;
	export let form: SuperValidated<any>;
	export let deleteForm: SuperValidated<any>;
	export let contractModal: Writable<boolean>;

	let contractDeleteModal = false;
	let activeContract: Contract | null = null;

	const contractModalOpener = (contract?: Contract): (() => void) => {
		return () => {
			activeContract = contract ?? null;
			contractModal.set(true);
		};
	};

	$: canAddContract = canEditStudent(username, student);
</script>

{#if student.contracts.length}
	<div class="flex flex-col gap-4 mb-6">
		{#each student.contracts as contract}
			{@const canEdit = canEditContract(username, contract)}
			<ContractItem {contract}>
				<div class="mt-8 flex gap-4 items-baseline">
					{#if canEdit}
						<UpdateButton onClick={contractModalOpener(contract)} />
					{/if}
					<GotoButton
						href={`/contract/${contract.id}`}
						text={canEdit ? 'Manage Staff' : 'Staff Details'}
					/>
					{#if canEdit}
						<DeleteButton
							onClick={() => {
								activeContract = contract;
								contractDeleteModal = true;
							}}
						/>
					{/if}
				</div>
			</ContractItem>
		{/each}
	</div>
	{#if canAddContract}
		<AddButton onClick={contractModalOpener()} text="Add a Contract" />
	{/if}
{:else}
	<div class="w-full flex p-8 bg-stone-50 rounded-lg">
		<Button on:click={contractModalOpener()}>Add a contract</Button>
	</div>
{/if}

<FormModal
	open={$contractModal}
	superform={form}
	fields={ContractForm}
	action={`/student/${student.id}?/createOrUpdateContract`}
	entity={activeContract}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeContract ? 'Update' : 'Create a'} contract`}
	on:close={() => contractModal.set(false)}
/>

<FormModal
	open={contractDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteContract`}
	entity={activeContract}
	title="Delete contract"
	on:close={() => (contractDeleteModal = false)}
>
	<DeleteMessage
		slot="preface"
		name={`this contract (${student.fullname}, ${activeContract?.type} ${activeContract?.target_year})`}
	/>
</FormModal>
