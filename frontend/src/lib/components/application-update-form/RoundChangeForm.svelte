<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Label, Select, Button, Helper, A } from 'flowbite-svelte';

	import type { ApplicationDetail } from '$lib/api/application';
	import { fetchApplicationRounds, type ApplicationRoundListItem } from '$lib/api/applicationRound';
	import { filterSortRounds, formatRound } from '$lib/utils/applicationRoundUtils';
	import { buildQuery } from '$lib/api/api';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: ApplicationDetail;

	let rounds: ApplicationRoundListItem[] = [];

	const { year, term } = entity.program_iteration;

	const onRedirect = () => {
		const params = {
			year: entity.program_iteration.year,
			term: entity.program_iteration.term,
			application: entity.id
		};
		goto(`/program/${entity.program.id}/plan/new${buildQuery(params)}`);
	};

	// TODO
	if ($message || $errors) {
	}

	onMount(async () => {
		rounds = await fetchApplicationRounds(entity.program.id);
		$form.id = entity.id;
		$form.round = entity.round.id;
	});
</script>

<input class="hidden" name="id" type="number" bind:value={$form.id} />

<Label for="round" class="form-label">Admission plan</Label>
<Select id="round" name="round" bind:value={$form.round} required>
	{#each filterSortRounds(rounds, year, term) as roundOption}
		<option value={roundOption.id}>{formatRound(roundOption)}</option>
	{/each}
</Select>
<Helper class="mt-4 form-helper">
	If your desired plan is not listed, <A on:click={onRedirect}>go to this page</A> and create it.
</Helper>

<Button type="submit" class="mt-8">Update</Button>
