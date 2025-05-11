<script lang="ts">
	import { page } from '$app/stores';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { ServiceSchema } from '$lib/schemas/service';
	import type { DeleteSchema } from '$lib/schemas/delete';

	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import Pencil from 'lucide-svelte/icons/pencil';
	import X from 'lucide-svelte/icons/x';
	import ServiceForm from '$lib/components/forms/ServiceForm.svelte';
	import DeleteForm from '$lib/components/forms/DeleteForm.svelte';

	import type { Service } from '$lib/api/contract';

	export let service: Service;
	export let contractId: number;
	export let updateForm: SuperValidated<Infer<ServiceSchema>>;
	export let deleteForm: SuperValidated<Infer<DeleteSchema>>;

	let updateModal = false;
	let deleteModal = false;
</script>

<ButtonDialog buttonSlot dialogTitle="Update Member Involvement" bind:open={updateModal}>
	<Pencil class="size-4 text-muted-foreground hover:text-mint-600" slot="button" />
	<p slot="description">{service.cf_username} &bullet; {service.role}</p>
	<ServiceForm
		data={updateForm}
		{contractId}
		cfUsers={$page.data.cfUsers}
		{service}
		onUpdated={({ form }) => form.valid && (updateModal = false)}
	/>
</ButtonDialog>

<ButtonDialog
	buttonSlot
	dialogTitle="Remove {service.cf_username}&rsquo;s role as {service.role}?"
	bind:open={deleteModal}
>
	<X class="size-4 text-muted-foreground hover:text-mint-600" slot="button" />
	<p slot="description" class="text-pretty">
		Do this only if the member was never assigned to this role in the first place. If they ceased to
		perform the role, <button
			class="text-mint-600 underline"
			on:click={() => {
				deleteModal = false;
				updateModal = true;
			}}>set an end date instead</button
		>.
	</p>
	<DeleteForm
		data={deleteForm}
		objectId={service.id}
		action="?/deleteService"
		onUpdated={({ form }) => form.valid && (deleteModal = false)}
		onCancel={() => (deleteModal = false)}
		deleteButtonText="Remove"
	/>
</ButtonDialog>
