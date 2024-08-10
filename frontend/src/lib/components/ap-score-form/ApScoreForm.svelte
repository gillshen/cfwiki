<script lang="ts">
	import { Label, Button, Input, Select } from 'flowbite-svelte';

	import type { ApScore } from '$lib/api/scores';
	import { apExams } from '$lib/constants/exams';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: ApScore | null = null;

	$form.id = entity?.id;
	$form.student = entity?.student;
	$form.date = entity?.date;
	$form.subject = entity?.subject;
	$form.score = entity?.score;

	// TODO
	if ($message || $errors) {
		//
	}
</script>

<input type="number" name="id" class="hidden" bind:value={$form.id} />

<div class="grid grid-cols-2 gap-x-8">
	<div>
		<Label for="date" class="form-label optional">Date</Label>
		<Input id="date" type="date" name="date" bind:value={$form.date} />
	</div>
	<div></div>

	<div class="col-span-2">
		<Label for="subject" class="form-label">Subject</Label>
		<Select id="subject" name="subject" bind:value={$form.subject} required>
			{#each Array.from(apExams).sort() as exam}
				<option value={exam}>{exam}</option>
			{/each}
		</Select>
	</div>

	<div>
		<Label for="score" class="form-label optional">Score</Label>
		<Input id="score" type="number" name="score" min="1" max="36" bind:value={$form.score} />
	</div>
</div>

<Button type="submit" class="mt-8">{entity ? 'Update' : 'Submit'}</Button>
