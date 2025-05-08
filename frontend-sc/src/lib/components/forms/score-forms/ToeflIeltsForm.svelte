<script lang="ts">
	import { cn } from '$lib/utils';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import FormButton from '$lib/components/ui/form/form-button.svelte';

	import type { IeltsScore, ToeflScore } from '$lib/api/scores';
	import type { IeltsSchema, ToeflSchema } from '$lib/schemas/scores';
	import Input from '$lib/components/forms/Input.svelte';

	export let data: SuperValidated<Infer<IeltsSchema>> | SuperValidated<Infer<ToeflSchema>>;
	export let onUpdated: (event: { form: typeof data }) => any;
	export let action: string;
	export let className: string = '';
	export let studentId: number;
	export let score: IeltsScore | ToeflScore | undefined = undefined;
	export { className as class };

	const id = `${action}-form-${score?.id}`;

	const form = superForm(data, { id, onUpdated });
	const { form: formData, enhance } = form;

	if (score) {
		$formData = { ...$formData, ...score };
	}
	$formData.student = studentId;
</script>

<form
	method="POST"
	{id}
	{action}
	use:enhance
	class={cn('max-w-prose space-y-4 my-4 mx-auto', className)}
>
	<input type="number" name="id" value={$formData.id} hidden />
	<input type="number" name="student" value={studentId} hidden />

	<Input {form} name="date" label="Test date" type="date" inputClass="tabular-nums" />
	<Input {form} name="reading" label="Reading" inputClass="tabular-nums" />
	<Input {form} name="listening" label="Listening" inputClass="tabular-nums" />
	<Input {form} name="speaking" label="Speaking" inputClass="tabular-nums" />
	<Input {form} name="writing" label="Writing" inputClass="tabular-nums" />

	<FormButton class="w-fit min-w-24">Submit</FormButton>
	<!-- <SuperDebug data={$formData} /> -->
</form>
