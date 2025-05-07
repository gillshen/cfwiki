<script lang="ts">
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { cn } from '$lib/utils';
	import type { Service } from '$lib/api/contract';
	import type { ServiceSchema } from '$lib/schemas/service';
	import type { CfUserListItem } from '$lib/api/user';
	import ServiceFormFields from './ServiceFormFields.svelte';

	export let data: SuperValidated<Infer<ServiceSchema>>;
	export let onUpdated: (event: { form: SuperValidated<Infer<ServiceSchema>> }) => any;
	export let action: string = '?/createOrUpdateService';
	export let className: string = '';
	export let contractId: number;
	export let cfUsers: CfUserListItem[];
	export let service: Service | undefined = undefined;
	export { className as class };

	const id = `service-form-${service?.id}`;

	const form = superForm(data, { id, resetForm: false, onUpdated });
	const { form: formData, enhance } = form;

	if (service) {
		$formData = { ...$formData, ...service };
	}
	$formData.contract = contractId;
</script>

<form
	method="POST"
	{id}
	{action}
	use:enhance
	class={cn('max-w-prose space-y-4 my-4 mx-auto', className)}
>
	<ServiceFormFields {form} {service} {cfUsers} />
</form>
