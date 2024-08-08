<script lang="ts">
	import { goto } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms';
	import { Button, Heading, Hr, Dropdown, A, Modal } from 'flowbite-svelte';
	import { ChevronRightOutline } from 'flowbite-svelte-icons';

	import StudentInfobox from '$lib/components/infobox/StudentInfobox.svelte';
	import DropdownActionItem from '$lib/components/list-items/DropdownActionItem.svelte';
	import ContractForm from '$lib/components/contract-form/ContractForm.svelte';
	import ContractItem from '$lib/components/list-items/ContractItem.svelte';
	import type { Contract } from '$lib/api/contract';

	export let data;

	const { form: contractForm, enhance: contractEnhance } = superForm(data.contractForm, {
		onUpdated({ form }) {
			if (form.valid) {
				contractModal = false;
			}
		}
	});

	$: canEdit = true;

	let contractModal = false;
	let activeContract: Contract | null = null;
</script>

<Heading tag="h1" class="alt-page-title">{data.student.fullname}</Heading>

<Hr />

<section class="flex gap-24">
	<article class="w-[36rem] min-w-[32rem] pb-8">
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
	</article>

	<article class="bg-slate-50 rounded-xl w-full min-w-[32rem] h-fit p-8 text-gray-400">
		{#if data.student.contracts_sorted.length}
			<div class="flex gap-8 mb-12">
				{#each data.student.contracts_sorted as contract}
					<ContractItem {contract}>
						{#if canEdit || !contract.services.length}
							<div class="mt-8 flex gap-6">
								<A
									class="text-sm"
									on:click={() => {
										activeContract = contract;
										contractModal = true;
									}}
								>
									Update
								</A>
								<A class="text-sm" on:click={() => alert('delete contract')}>Delete</A>
							</div>
						{/if}
					</ContractItem>
				{/each}
			</div>
		{/if}
		<Button
			outline
			on:click={() => {
				activeContract = null;
				contractModal = true;
			}}
		>
			Add a contract
		</Button>
	</article>
</section>

<Modal
	title={`${activeContract ? 'Update' : 'Create a'} contract`}
	bind:open={contractModal}
	outsideclose
>
	<form class="modal" method="post" action="?/createOrUpdateContract" use:contractEnhance>
		<input class="hidden" type="number" name="student" bind:value={data.student.id} />
		<div class="form-width mx-auto">
			<ContractForm
				form={contractForm}
				contract={activeContract}
				submitButtonText={activeContract ? 'Update' : 'Submit'}
			/>
		</div>
	</form>
</Modal>

<Hr />

<Button outline href={`/student/${data.student.id}/new-application`}>Create an application</Button>
