<script lang="ts">
	import { cn } from '$lib/utils';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	import type { NewProgramSchema } from '$lib/schemas/program';
	import type { School } from '$lib/api/school';
	import ProgramFormFields from './ProgramFormFields.svelte';

	export let data: SuperValidated<Infer<NewProgramSchema>>;
	export let onUpdated: (event: { form: typeof data }) => any;
	export let action: string = '?/createProgram';
	export let schools: School[];
	export let className: string = '';
	export { className as class };

	const id = 'new-program-form';

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
	<ProgramFormFields {form} {schools} />
</form>
