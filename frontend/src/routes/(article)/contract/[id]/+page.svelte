<script lang="ts">
	import { A, Button, Heading, Hr } from 'flowbite-svelte';

	import type { Service } from '$lib/api/contract';
	import { orderByEndDateRole } from '$lib/utils/serviceUtils';
	import ServiceItem from '$lib/components/list-items/ServiceItem.svelte';
	import ServiceForm from '$lib/components/service-form/ServiceForm.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import Toast from '$lib/components/misc/Toast.svelte';

	export let data;

	$: canEdit = true;

	let serviceModal = false;
	let serviceDeleteModal = false;
	let activeService: Service | null = null;

	const modalOpener = (service?: Service) => {
		return () => {
			activeService = service ?? null;
			serviceModal = true;
		};
	};

	let showToast = false;
</script>

<Heading tag="h1" class="alt-page-title">
	<A href={`/student/${data.contract.student}`}>{data.contract.student_name}</A>
	| {data.contract.type}
	{data.contract.target_year}
</Heading>

<Hr />

{#if data.contract.services.length}
	<section class="mb-8 w-fit flex flex-wrap gap-8">
		{#each data.contract.services.sort(orderByEndDateRole) as service}
			<ServiceItem {service}>
				{#if canEdit}
					<div class="mt-8">
						<UpdateDeleteButton
							updateAction={modalOpener(service)}
							deleteAction={() => {
								activeService = service;
								serviceDeleteModal = true;
							}}
						/>
					</div>
				{/if}
			</ServiceItem>
		{/each}
	</section>
{/if}

<Button outline on:click={modalOpener()}>Add staff</Button>

<FormModal
	open={serviceModal}
	superform={data.serviceForm}
	fields={ServiceForm}
	action="?/createOrUpdateService"
	entity={activeService}
	title={activeService ? 'Update staff information' : 'Add staff'}
	extra={[{ name: 'contract', type: 'number', value: data.contract.id }]}
	cfers={data.cfUsers}
	on:close={() => (serviceModal = false)}
/>

<FormModal
	open={serviceDeleteModal}
	superform={data.serviceDeleteForm}
	fields={DeleteForm}
	action="?/deleteService"
	entity={activeService}
	title="Delete staff"
	on:close={() => (serviceDeleteModal = false)}
>
	<DeleteMessage
		slot="preface"
		name={`this record (${activeService?.cf_username} advising ${data.contract.student_name})`}
	/>
</FormModal>

{#if showToast}
	<Toast type="error" onClose={() => (showToast = false)}>
		Operation failed. Maybe you were trying to duplicate an existing record?
	</Toast>
{/if}
