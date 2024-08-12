<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { A, Button, Heading, Hr, Modal } from 'flowbite-svelte';

	import { type Service, sortServicesByRole } from '$lib/api/contract';
	import ServiceItem from '$lib/components/list-items/ServiceItem.svelte';
	import ServiceForm from '$lib/components/service-form/ServiceForm.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';

	export let data;

	const { form, enhance } = superForm(data.serviceForm, {
		onUpdated({ form }) {
			if (form.valid) {
				serviceModal = false;
			}
		}
	});

	$: canEdit = true;

	let serviceModal = false;
	let activeService: Service | null = null;

	const modalOpener = (service?: Service) => {
		return () => {
			activeService = service ?? null;
			serviceModal = true;
		};
	};
</script>

<Heading tag="h1" class="alt-page-title">
	<A href={`/student/${data.contract.student}`}>{data.contract.student_name}</A>
	| {data.contract.type}
	{data.contract.target_year}
</Heading>

<Hr />

{#if data.contract.services.length}
	<section class="max-w-[36rem] mb-8 flex gap-8 flex-wrap">
		{#each data.contract.services.sort(sortServicesByRole) as service}
			<ServiceItem {service}>
				{#if canEdit}
					<div class="mt-8">
						<UpdateDeleteButton
							updateAction={modalOpener(service)}
							deleteAction={() => alert('delete')}
						/>
					</div>
				{/if}
			</ServiceItem>
		{/each}
	</section>
{/if}

<Button outline on:click={modalOpener()}>Add staff</Button>

<Modal
	title={activeService ? 'Update staff information' : 'Add staff'}
	bind:open={serviceModal}
	outsideclose
>
	<form class="modal" method="post" action="?/createOrUpdateService" use:enhance>
		<input type="number" name="contract" class="hidden" bind:value={data.contract.id} />
		<div class="form-width mx-auto">
			<ServiceForm
				{form}
				service={activeService}
				cfPeople={data.cfUsers}
				submitButtonText={activeService ? 'Update' : 'Submit'}
			/>
		</div>
	</form>
</Modal>
