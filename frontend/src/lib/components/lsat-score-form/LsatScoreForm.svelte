<script lang="ts">
	import { Label, Input, Button } from 'flowbite-svelte';

	import type { LsatScore } from '$lib/api/scores';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: LsatScore | null = null;

	$form.id = entity?.id;
	$form.date = entity?.date;
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

	<div>
		<Label for="score" class="form-label optional">Score</Label>
		<Input id="score" type="number" name="score" min="120" max="180" bind:value={$form.score} />
	</div>
</div>

<Button type="submit" class="mt-8">Submit</Button>
