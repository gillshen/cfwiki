<script lang="ts">
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import type { Service } from '$lib/api/contract';
	import type { ServiceSchema } from '$lib/schemas/service';
	import type { CfUserListItem } from '$lib/api/user';
	import Fields from './Fields.svelte';
	import { cn } from '$lib/utils';

	export let superValidated: SuperValidated<Infer<ServiceSchema>>;
	export let onUpdated: (event: { form: SuperValidated<Infer<ServiceSchema>> }) => any;
	export let action: string = '?/createOrUpdateService';
	export let className: string = '';
	export let contractId: number;
	export let cfUsers: CfUserListItem[];
	export let service: Service | undefined = undefined;
	export { className as class };

	const id = `service-form-${String(service?.id)}`;

	const form = superForm(superValidated, {
		id,
		resetForm: false,
		onUpdated
	});

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
	<Fields {form} {service} {cfUsers} />
</form>
