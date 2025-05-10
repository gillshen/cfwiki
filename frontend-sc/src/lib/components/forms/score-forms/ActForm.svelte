<script lang="ts">
	import { cn } from '$lib/utils';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import FormButton from '$lib/components/ui/form/form-button.svelte';

	import type { ActScore } from '$lib/api/scores';
	import type { ActScoreSchema } from '$lib/schemas/scores';
	import Input from '$lib/components/forms/Input.svelte';

	export let data: SuperValidated<Infer<ActScoreSchema>>;
	export let onUpdated: (event: { form: typeof data }) => any;
	export let action: string = '?/createOrUpdateActScore';
	export let className: string = '';
	export let studentId: number;
	export let score: ActScore | undefined = undefined;
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
	<input type="number" name="id" value={score?.id} hidden />
	<input type="number" name="student" value={studentId} hidden />

	<Input {form} name="date" label="Test date" type="date" inputClass="tabular-nums" optional />
	<Input {form} name="english" label="English" inputClass="tabular-nums" optional />
	<Input {form} name="math" label="Math" inputClass="tabular-nums" optional />
	<Input {form} name="reading" label="Reading" inputClass="tabular-nums" optional />
	<Input {form} name="science" label="Science" inputClass="tabular-nums" optional />
	<Input {form} name="writing" label="Writing" inputClass="tabular-nums" optional />

	<FormButton class="w-fit min-w-24">Submit</FormButton>
	<!-- <SuperDebug data={$formData} /> -->
</form>
