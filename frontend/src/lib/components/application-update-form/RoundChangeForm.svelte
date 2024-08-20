<script lang="ts">
	import { Label, Select, Button } from 'flowbite-svelte';

	import type { ApplicationDetail } from '$lib/api/application';
	import { getRoundNames } from '$lib/constants/applicationRounds';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: ApplicationDetail;

	$form.id = entity.id;
	$form.program = entity.program.id;
	$form.year = entity.program_iteration.year;
	$form.term = entity.program_iteration.term;
	$form.round_name = entity.round.name;

	// TODO
	if ($message || $errors) {
		//
	}
</script>

<input class="hidden" name="id" type="number" bind:value={$form.id} />
<input class="hidden" name="program" type="number" bind:value={$form.program} />
<input class="hidden" name="year" type="number" bind:value={$form.year} />
<input class="hidden" name="term" type="string" bind:value={$form.term} />

<Label for="round-name" class="form-label">Round</Label>
<Select id="round-name" name="round_name" bind:value={$form.round_name} required>
	{#each getRoundNames(entity.program.type) as roundName}
		<option value={roundName}>{roundName}</option>
	{/each}
</Select>

<Button type="submit" class="mt-8">Update</Button>
