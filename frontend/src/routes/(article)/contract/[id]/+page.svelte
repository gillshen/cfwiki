<script lang="ts">
	import { Alert, Breadcrumb, BreadcrumbItem, Button, Heading, Hr } from 'flowbite-svelte';
	import { InfoCircleOutline } from 'flowbite-svelte-icons';

	import type { Service } from '$lib/api/contract';
	import { canEditContract } from '$lib/utils/userUtils';
	import { orderByEndDateRole } from '$lib/utils/serviceUtils';
	import ServiceItem from '$lib/components/list-items/ServiceItem.svelte';
	import UpdateButton from '$lib/components/buttons/UpdateButton.svelte';
	import DeleteButton from '$lib/components/buttons/DeleteButton.svelte';
	import ServiceForm from '$lib/components/service-form/ServiceForm.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import Toast from '$lib/components/misc/Toast.svelte';
	import BreadcrumbLink from '$lib/components/misc/BreadcrumbLink.svelte';

	export let data;

	$: canEdit = canEditContract(data.username, data.contract);

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
	{data.contract.student_name} | {data.contract.type}
	{data.contract.target_year}
</Heading>

<Hr />

<Breadcrumb class="mb-8">
	<BreadcrumbLink text={data.contract.student_name} href={`/student/${data.contract.student}`} />
	<BreadcrumbItem>Contract: {data.contract.type} {data.contract.target_year}</BreadcrumbItem>
</Breadcrumb>

{#if data.contract.services.length}
	<section class="mb-8 w-fit flex flex-wrap gap-8">
		{#each data.contract.services.sort(orderByEndDateRole) as service}
			<ServiceItem {service}>
				{#if canEdit}
					<div class="mt-8 flex gap-4 items-baseline">
						<UpdateButton onClick={modalOpener(service)} />
						<DeleteButton
							onClick={() => {
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

{#if canEdit}
	{#if !data.contract.services.length}
		<Alert color="yellow" class="mb-4 max-w-prose flex gap-2">
			<InfoCircleOutline />
			<div class="flex flex-col gap-2">
				<p><strong>Add yourself first!</strong></p>
				<p>
					You can add, update, and remove staff members of this contract only if you are yourself a
					staff member (or if no one is). So, be sure to add yourself first, or you&rsquo;ll have to
					ask someone else to add you.
				</p>
			</div>
		</Alert>
	{/if}
	<Button outline on:click={modalOpener()} class="w-fit">Add staff</Button>
{/if}

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
