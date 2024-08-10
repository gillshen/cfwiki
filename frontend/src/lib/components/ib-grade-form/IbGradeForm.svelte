<script lang="ts">
	import { Label, Button, Input, Select, Radio } from 'flowbite-svelte';

	import type { IbGrade } from '$lib/api/scores';
	import { ibExams } from '$lib/constants/exams';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: IbGrade | null = null;

	$form.id = entity?.id;
	$form.student = entity?.student;
	$form.date = entity?.date;
	$form.type = entity?.type;
	$form.subject = entity?.subject;
	$form.score = entity?.grade;

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
			<Radio name="type" value="predicted" class="font-normal" bind:group={$form.type}
				>Predicted</Radio
			>
			<Radio name="type" value="final" class="font-normal" bind:group={$form.type} required
				>Final</Radio
			>
		</div>
	</div>

	<div class="col-span-2">
		<Label for="subject" class="form-label">Subject</Label>
		<Select id="subject" name="subject" bind:value={$form.subject} required>
			{#each Array.from(ibExams).sort() as exam}
				<option value={exam}>{exam}</option>
			{/each}
		</Select>
	</div>

	<div>
		<Label for="grade" class="form-label optional">Grade</Label>
		<Input id="grade" type="number" name="grade" min="1" max="7" bind:value={$form.grade} />
	</div>
</div>

<Button type="submit" class="mt-8">{entity ? 'Update' : 'Submit'}</Button>
