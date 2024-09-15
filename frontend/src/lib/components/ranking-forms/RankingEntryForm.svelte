<script lang="ts">
	import { Label, Button, Input, Select, Heading } from 'flowbite-svelte';

	import type { SchoolRanking, SchoolRankingEntry } from '$lib/api/ranking';
	import type { School } from '$lib/api/school';
	import { orderByName } from '$lib/utils/schoolUtils';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let schools: School[];

	// For updating an existing entry
	export let entity: SchoolRankingEntry | null = null;
	// For creating a new entry
	export let ranking: SchoolRanking | null = null;

	$: activeRanking = entity?.ranking ?? ranking;

	$: {
		$form.id = entity?.id;
		$form.ranking = activeRanking?.id;
		$form.school = entity?.school.id;
		$form.rank = entity?.rank;
	}

	// TODO
	if ($message || $errors) {
	}
</script>

<input type="number" name="id" class="hidden" bind:value={$form.id} />
<input type="number" name="ranking" class="hidden" bind:value={$form.ranking} />

<Heading tag="h3" class="text-lg font-medium text-gray-700">
	{activeRanking?.name}
	{activeRanking?.year}
</Heading>

<Label for="school" class="form-label">School</Label>
<Select id="school" name="school" bind:value={$form.school} required>
	{#each schools
		.filter((s) => entity === null || s.id === entity.school.id)
		.sort(orderByName) as school}
		<option value={school.id}>{school.name}</option>
	{/each}
</Select>

<div class="grid grid-cols-2 gap-x-8">
	<div>
		<Label for="rank" class="form-label">Rank</Label>
		<Input id="rank" type="number" name="rank" min="1" step="1" bind:value={$form.rank} />
	</div>
</div>

<Button type="submit" class="mt-8">{entity ? 'Update' : 'Submit'}</Button>
