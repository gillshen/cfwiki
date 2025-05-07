<script lang="ts">
	import type { SuperForm, Infer } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import Input from '$lib/components/forms/Input.svelte';

	import type { ServiceSchema } from '$lib/schemas/service';
	import type { Service } from '$lib/api/contract';
	import type { CfUserListItem } from '$lib/api/user';
	import { cfRoles } from '$lib/api/service';
	import { orderByUsername } from '$lib/util/userUtils';

	export let form: SuperForm<Infer<ServiceSchema>>;
	export let cfUsers: CfUserListItem[];
	export let service: Service | undefined = undefined;

	const { form: formData } = form;

	const onUsernameSelection = () => {
		$formData.cfer = cfUsers.find((cfer) => cfer.username === $formData._cf_username)?.id as number;
	};
</script>

<input type="number" name="id" value={$formData.id} hidden />
<input type="number" name="contract" value={$formData.contract} hidden />
<input type="number" name="cfer" value={$formData.cfer} hidden />

{#if service}
	<input name="role" value={$formData.role} hidden />
{:else}
	<Combobox
		{form}
		name="_cf_username"
		label="CFer"
		items={cfUsers.sort(orderByUsername).map((cfer) => cfer.username)}
		postSelect={onUsernameSelection}
	/>

	<Combobox {form} name="role" label="Role" items={[...cfRoles]} />
{/if}

<Input
	{form}
	name="start_date"
	label="Start date"
	type="date"
	description="If same as contract start date, leave blank"
	optional
/>

<Input
	{form}
	name="end_date"
	label="End date"
	type="date"
	description="If same as contract end date, leave blank"
	optional
/>

<Form.Button class="w-fit min-w-24">Submit</Form.Button>
<!-- <SuperDebug data={$formData} /> -->
