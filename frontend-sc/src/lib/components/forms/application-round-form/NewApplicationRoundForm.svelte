<script lang="ts">
	import { cn } from '$lib/utils';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	import type { NewApplicationRoundSchema } from '$lib/schemas/applicationRound';
	import NewApplicationRoundFormFields from './NewApplicationRoundFormFields.svelte';

	export let data: SuperValidated<Infer<NewApplicationRoundSchema>>;
	export let onUpdated: (event: { form: typeof data }) => any;
	export let action: string = '?/createApplicationRound';
	export let programId: number;
	export let year: number | undefined = undefined;
	export let term: string | undefined = undefined;
	export let className: string = '';
	export { className as class };

	const id = `application-round-form-${Math.random()}`;

	const form = superForm(data, { id, onUpdated });
	const { enhance } = form;
</script>

<form
	method="POST"
	{id}
	{action}
	use:enhance
	class={cn('max-w-prose flex flex-col justify-start text-left gap-6 my-4 mx-auto', className)}
>
	<NewApplicationRoundFormFields {form} {programId} {year} {term} />
</form>
