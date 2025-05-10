<script lang="ts">
	import { cn } from '$lib/utils';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import FormButton from '$lib/components/ui/form/form-button.svelte';

	import type { ApScore } from '$lib/api/scores';
	import type { ApScoreSchema } from '$lib/schemas/scores';
	import Input from '$lib/components/forms/Input.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import { AP_EXAMS } from '$lib/constants/exams';

	export let data: SuperValidated<Infer<ApScoreSchema>>;
	export let onUpdated: (event: { form: typeof data }) => any;
	export let action: string = '?/createOrUpdateApScore';
	export let className: string = '';
	export let studentId: number;
	export let score: ApScore | undefined = undefined;
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
	<Combobox {form} name="subject" label="Subject" items={[...AP_EXAMS]} />
	<Input {form} name="score" label="Score" inputClass="tabular-nums" optional />

	<FormButton class="w-fit min-w-24">Submit</FormButton>
	<!-- <SuperDebug data={$formData} /> -->
</form>
