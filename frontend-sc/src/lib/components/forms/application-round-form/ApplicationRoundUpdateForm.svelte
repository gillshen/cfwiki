<script lang="ts">
	import { cn } from '$lib/utils';
	import { superForm, type Infer, type SuperForm, type SuperValidated } from 'sveltekit-superforms';

	import type {
		ApplicationRoundUpdateSchema,
		CommonApplicationRoundSchema
	} from '$lib/schemas/applicationRound';

	import type { ApplicationRoundDetail } from '$lib/api/applicationRound';
	import CommonApplicationRoundFormFields from './CommonApplicationRoundFormFields.svelte';

	export let data: SuperValidated<Infer<ApplicationRoundUpdateSchema>>;
	export let onUpdated: (event: { form: typeof data }) => any;
	export let action: string = '?/updateApplicationRound';
	export let applicationRound: ApplicationRoundDetail;
	export let className: string = '';
	export { className as class };

	const id = `application-round-form-${applicationRound.id}`;

	const form = superForm(data, { id, onUpdated });
	const _form = form as unknown as SuperForm<Infer<CommonApplicationRoundSchema>>;
	const { form: formData, enhance } = form;

	const { program_iteration } = applicationRound;

	$formData = { ...$formData, ...program_iteration, ...applicationRound };
</script>

<form
	method="POST"
	{id}
	{action}
	use:enhance
	class={cn('max-w-prose flex flex-col justify-start text-left gap-6 my-4 mx-auto', className)}
>
	<input type="number" name="id" value={$formData.id} hidden />

	<CommonApplicationRoundFormFields form={_form} />
</form>
