<script lang="ts">
	import { cn } from '$lib/utils';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	import type { ProgramSchema } from '$lib/schemas/program';
	import type { ProgramDetail } from '$lib/api/program';
	import type { School } from '$lib/api/school';
	import ProgramFormFields from './ProgramFormFields.svelte';

	export let data: SuperValidated<Infer<ProgramSchema>>;
	export let onUpdated: (event: { form: typeof data }) => any;
	export let action: string;
	export let program: ProgramDetail | undefined = undefined;
	export let schools: School[] = [];
	export let className: string = '';
	export { className as class };

	const id = `program-form-${Math.random()}`;

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
	<ProgramFormFields {form} {program} {schools} />
</form>
