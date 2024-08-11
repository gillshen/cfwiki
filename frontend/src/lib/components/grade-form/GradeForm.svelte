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
	$form.is_cumulative = entity?.is_cumulative;
	$form.comments = entity?.comments;

	// TODO
	if ($message || $errors) {
		//
	}
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

	<div>
		<Label for="value" class="form-label">Value</Label>
		<Input id="value" type="number" name="value" step="0.001" bind:value={$form.value} required />
	</div>
	<div>
		<Label for="scale" class="form-label">Scale</Label>
		<Input id="scale" type="number" name="scale" step="0.001" bind:value={$form.scale} required />
	</div>

	<div>
		<Checkbox class="form-checkbox" name="is_cumulative" bind:checked={$form.is_cumulative}>
			Cumulative
		</Checkbox>
	</div>
	<div></div>

	<div class="col-span-2">
		<Label for="comments" class="form-label optional">Comments</Label>
		<Textarea id="comments" name="comments" bind:value={$form.comments} rows="4" />
	</div>
</div>

<Button type="submit" class="mt-8">{entity ? 'Update' : 'Submit'}</Button>
