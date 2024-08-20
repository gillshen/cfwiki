<script lang="ts">
	import { Label, Button, Input, Select, Radio } from 'flowbite-svelte';

	import type { AlevelGrade } from '$lib/api/scores';
	import { alevelExams } from '$lib/constants/exams';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: AlevelGrade | null = null;

	$form.id = entity?.id;
	$form.student = entity?.student;
	$form.date = entity?.date;
	$form.type = entity?.type;
	$form.subject = entity?.subject;
	$form.percentage = entity?.percentage;
	$form.grade = entity?.grade;

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

	<div>
		<Label for="date" class="form-label">Predicted or final</Label>
		<div class="grid grid-cols-1 gap-2">
			<Radio name="type" value="predicted" class="form-radio" bind:group={$form.type}
				>Predicted</Radio
			>
			<Radio name="type" value="final" class="form-radio" bind:group={$form.type} required
				>Final</Radio
			>
		</div>
	</div>

	<div class="col-span-2">
		<Label for="subject" class="form-label">Subject</Label>
		<Select id="subject" name="subject" bind:value={$form.subject} required>
			{#each Array.from(alevelExams).sort() as exam}
				<option value={exam}>{exam}</option>
			{/each}
		</Select>
	</div>

	<div>
		<Label for="grade" class="form-label optional">Grade</Label>
		<Select id="grade" name="grade" bind:value={$form.grade}>
			{#each ['A*', 'A', 'B', 'C', 'D', 'E', 'F'] as grade}
				<option value={grade}>{grade}</option>
			{/each}
		</Select>
	</div>
	<div>
		<Label for="percentage" class="form-label optional">Percentage</Label>
		<Input
			id="percentage"
			type="number"
			name="percentage"
			min="0"
			max="100"
			bind:value={$form.percentage}
		/>
	</div>
</div>

<Button type="submit" class="mt-8">{entity ? 'Update' : 'Submit'}</Button>
