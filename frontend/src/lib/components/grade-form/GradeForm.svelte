<script lang="ts">
	import { Label, Button, Input, Select, Checkbox, Textarea } from 'flowbite-svelte';

	import type { Grade } from '$lib/api/grade';
	import { allProgressions, gradingPeriods } from '$lib/constants/progressions';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: Grade | null = null;

	$form.id = entity?.id;
	$form.enrollment = entity?.enrollment;
	$form.progression = entity?.progression;
	$form.term = entity?.term;
	$form.value = entity?.value;
	$form.scale = entity?.scale;
	$form.is_weighted = entity?.is_weighted;
	$form.is_cumulative = entity?.is_cumulative;
	$form.comments = entity?.comments;

	// TODO
	if ($message || $errors) {
		//
	}

	let descriptionInsteadOfNumber = false;
</script>

<input type="number" name="id" class="hidden" bind:value={$form.id} />

<div class="grid grid-cols-2 gap-x-8">
	<div>
		<Label for="progression" class="form-label">Progression</Label>
		<Select id="progression" name="progression" bind:value={$form.progression} required>
			{#each allProgressions as progression}
				<option value={progression}>{progression}</option>
			{/each}
		</Select>
	</div>
	<div>
		<Label for="term" class="form-label">Grading period</Label>
		<Select id="term" name="term" bind:value={$form.term} required>
			{#each gradingPeriods as term}
				<option value={term}>{term}</option>
			{/each}
		</Select>
	</div>

	<Checkbox
		class="font-normal mt-8 mb-2 space-x-1 col-span-2"
		bind:checked={descriptionInsteadOfNumber}
	>
		Numeric GPA not available. I will provide a verbal description.
	</Checkbox>

	{#if !descriptionInsteadOfNumber}
		<div>
			<Label for="value" class="form-label">Value</Label>
			<Input id="value" type="number" name="value" step="0.001" bind:value={$form.value} required />
		</div>
		<div>
			<Label for="scale" class="form-label">Scale</Label>
			<Input
				id="scale"
				type="number"
				name="scale"
				min="0.001"
				step="0.001"
				bind:value={$form.scale}
				required
			/>
		</div>

		<div class="mt-6 mb-6 col-span-2 flex flex-col gap-4">
			<Checkbox name="is_weighted" class="font-normal space-x-1" bind:checked={$form.is_weighted}>
				Weighted
			</Checkbox>
			<Checkbox
				name="is_cumulative"
				class="font-normal space-x-1"
				bind:checked={$form.is_cumulative}
			>
				Cumulative
			</Checkbox>
		</div>
	{/if}

	<div class="col-span-2">
		{#if descriptionInsteadOfNumber}
			<Label for="comments" class="form-label">Description</Label>
		{:else}
			<Label for="comments" class="form-label optional">Comments</Label>
		{/if}
		<Textarea
			id="comments"
			name="comments"
			maxlength="500"
			bind:value={$form.comments}
			rows="4"
			required={descriptionInsteadOfNumber}
		/>
	</div>
</div>

<Button type="submit" class="mt-8">{entity ? 'Update' : 'Submit'}</Button>
