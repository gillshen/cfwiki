<script lang="ts">
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { cn } from '$lib/utils';
	import Input from '$lib/components/forms/Input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import FormButton from '$lib/components/ui/form/form-button.svelte';

	import Combobox from '$lib/components/forms/Combobox.svelte';
	import NcCombobox from '$lib/components/interactive/Combobox.svelte';
	import type { Service } from '$lib/api/contract';
	import type { ServiceSchema } from '$lib/schemas/service';
	import type { CfUserListItem } from '$lib/api/user';
	import { CF_ROLES } from '$lib/api/service';
	import { orderByUsername } from '$lib/util/userUtils';

	export let data: SuperValidated<Infer<ServiceSchema>>;
	export let onUpdated: (event: { form: typeof data }) => any;
	export let action: string = '?/createOrUpdateService';
	export let className: string = '';
	export let contractId: number;
	export let cfUsers: CfUserListItem[];
	export let service: Service | undefined = undefined;
	export { className as class };

	const id = `service-form-${service?.id}`;

	const form = superForm(data, { id, resetForm: false, onUpdated });
	const { form: formData, enhance } = form;

	const onUsernameSelection = () => {
		$formData.cfer = cfUsers.find((cfer) => cfer.username === selectedCfer)?.id as number;
	};

	if (service) {
		$formData = { ...$formData, ...service };
	}
	$formData.contract = contractId;

	let selectedCfer = '';
</script>

<form
	method="POST"
	{id}
	{action}
	use:enhance
	class={cn('max-w-prose flex flex-col gap-6 my-4 mx-auto', className)}
>
	<input type="number" name="id" value={$formData.id} hidden />
	<input type="number" name="contract" value={$formData.contract} hidden />
	<input type="number" name="cfer" value={$formData.cfer} hidden />

	{#if service}
		<input name="role" value={$formData.role} hidden />
	{:else}
		<div class="flex flex-col gap-2">
			<Label>CFer</Label>
			<NcCombobox
				bind:value={selectedCfer}
				items={cfUsers.sort(orderByUsername).map((cfer) => cfer.username)}
				onSelect={onUsernameSelection}
			/>
		</div>

		<Combobox {form} name="role" label="Role" items={[...CF_ROLES]} disableSearch />
	{/if}

	<Input
		{form}
		name="start_date"
		label="Start date, if after start of contract"
		type="date"
		optional
	/>

	<Input
		{form}
		name="end_date"
		label="End date, if prior to end of contract"
		type="date"
		optional
	/>

	<FormButton class="w-fit min-w-24">Submit</FormButton>
	<!-- <SuperDebug data={$formData} /> -->
</form>
