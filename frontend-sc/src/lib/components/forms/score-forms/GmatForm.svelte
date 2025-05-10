<script lang="ts">
	import { cn } from '$lib/utils';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import Switch from '$lib/components/ui/switch/switch.svelte';

	import type { GmatScore } from '$lib/api/scores';
	import type { GmatScoreSchema } from '$lib/schemas/scores';
	import Input from '$lib/components/forms/Input.svelte';

	export let data: SuperValidated<Infer<GmatScoreSchema>>;
	export let onUpdated: (event: { form: typeof data }) => any;
	export let action: string = '?/createOrUpdateGmatScore';
	export let className: string = '';
	export let studentId: number;
	export let score: GmatScore | undefined = undefined;
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

	<Form.Field {form} name="is_legacy">
		<Form.Control let:attrs>
			<div class="flex items-center space-x-2 py-2">
				<Switch includeInput {...attrs} bind:checked={$formData.is_legacy} />
				<Form.Label class="font-normal">Pre-2024 version</Form.Label>
			</div>
		</Form.Control>
	</Form.Field>

	<Input {form} name="date" label="Test date" type="date" inputClass="tabular-nums" optional />
	<Input {form} name="verbal" label="Verbal" inputClass="tabular-nums" optional />
	<Input {form} name="quant" label="Quantitative" inputClass="tabular-nums" optional />

	{#if $formData.is_legacy}
		<Input
			{form}
			name="reasoning"
			label="Integrated reasoning"
			inputClass="tabular-nums"
			optional
		/>
		<Input {form} name="writing" label="Writing" inputClass="tabular-nums" optional />
	{:else}
		<Input {form} name="data_insights" label="Data insights" inputClass="tabular-nums" optional />
	{/if}

	<Input {form} name="total" label="Total" inputClass="tabular-nums" optional />

	<Form.Button class="w-fit min-w-24">Submit</Form.Button>
	<!-- <SuperDebug data={$formData} /> -->
</form>
