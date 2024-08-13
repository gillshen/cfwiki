<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Button } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';

	import type { StudentDetail } from '$lib/api/student';
	import type { Contract } from '$lib/api/contract';
	import ContractItem from '$lib/components/list-items/ContractItem.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import LinkButton from '$lib/components/buttons/LinkButton.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import ContractForm from '$lib/components/contract-form/ContractForm.svelte';

	export let student: StudentDetail;
	export let canEdit: boolean = false;
	export let form: SuperValidated<any>;

	let contractModal = false;
	let activeContract: Contract | null = null;

	const modalOpener = (contract?: Contract): (() => void) => {
		return () => {
			activeContract = contract ?? null;
			contractModal = true;
		};
	};
</script>

<article class="bg-slate-50 rounded-xl w-full h-fit p-8">
	{#if student.contracts_sorted.length}
		<div class="flex gap-8 mb-8">
			{#each student.contracts_sorted as contract}
				<ContractItem {contract}>
					{#if canEdit || !contract.services.length}
						<UpdateDeleteButton
							updateAction={modalOpener(contract)}
							deleteAction={() => alert('delete contract')}
						/>
					{/if}
				</ContractItem>
			{/each}
		</div>
		{#if canEdit}
			<LinkButton text="Add a contract" action={modalOpener()}>
				<PlusOutline slot="icon" />
			</LinkButton>
		{/if}
	{:else}
		<Button on:click={modalOpener()}>Add a contract</Button>
	{/if}
</article>

<FormModal
	open={contractModal}
	superform={form}
	fields={ContractForm}
	action={`/student/${student.id}?/createOrUpdateContract`}
	entity={activeContract}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeContract ? 'Update' : 'Create a'} contract`}
	on:close={() => (contractModal = false)}
/>
