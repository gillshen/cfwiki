<script lang="ts">
	import { cn } from '$lib/utils';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	import type { Grade } from '$lib/api/grade';
	import type { GradeSchema } from '$lib/schemas/grade';
	import Textarea from './Textarea.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import { GRADING_PERIODS } from '$lib/constants/progressions';

	export let data: SuperValidated<Infer<GradeSchema>>;
	export let onUpdated: (event: { form: typeof data }) => any;
	export let action: string = '?/createOrUpdateGrade';
	export let className: string = '';
	export let enrollmentId: number;
	export let progressions: string[];
	export let grade: Grade | undefined = undefined;
	export { className as class };

	const id = `grade-form-${grade?.id}}`;

	const form = superForm(data, { id, resetForm: false, onUpdated });
	const { form: formData, enhance } = form;

	if (grade) {
		$formData = { ...$formData, ...grade };

		// `_use_comments` is a helper field that doesn't exist in the database
		// must be initialized by hand when updating an existing grade
		$formData._use_comments = !!grade.comments;
	}
</script>

<form
	method="POST"
	{id}
	{action}
	use:enhance
	class={cn('max-w-prose space-y-4 my-4 mx-auto', className)}
>
	<input type="number" name="id" value={grade?.id} hidden />
	<input type="number" name="enrollment" value={enrollmentId} hidden />

	<Combobox {form} name="progression" label="Progression" items={progressions} disableSearch />

	<Combobox {form} name="term" label="Grading period" items={[...GRADING_PERIODS]} disableSearch />

	<Form.Field {form} name="_use_comments">
		<Form.Control let:attrs>
			<div class="flex items-center space-x-2 py-2">
				<Switch includeInput {...attrs} bind:checked={$formData._use_comments} />
				<Form.Label class="font-normal">Provide a description instead of numeric values</Form.Label>
			</div>
		</Form.Control>
	</Form.Field>

	{#if $formData._use_comments}
		<Textarea {form} name="comments" label="Description" />
	{:else}
		<Input {form} name="value" label="Grade" inputClass="w-[100px] text-right" />
		<Input {form} name="scale" label="Grading scale" inputClass="w-[100px] text-right" />

		<Form.Field {form} name="is_weighted" class="flex flex-row items-start space-x-3 space-y-0">
			<Form.Control let:attrs>
				<Checkbox {...attrs} bind:checked={$formData.is_weighted} />
				<div class="space-y-1 leading-none">
					<Form.Label>Weighted</Form.Label>
				</div>
				<input name={attrs.name} value={$formData.is_weighted} hidden />
			</Form.Control>
		</Form.Field>
	{/if}

	<Form.Field
		{form}
		name="is_cumulative"
		class="flex flex-row items-start space-x-3 space-y-0 pb-4"
	>
		<Form.Control let:attrs>
			<Checkbox {...attrs} bind:checked={$formData.is_cumulative} />
			<div class="space-y-1 leading-none">
				<Form.Label>Cumulative</Form.Label>
			</div>
			<input name={attrs.name} value={$formData.is_cumulative} hidden />
		</Form.Control>
	</Form.Field>

	<Form.Button class="w-fit min-w-24">Submit</Form.Button>
	<!-- <SuperDebug data={$formData} /> -->
</form>
