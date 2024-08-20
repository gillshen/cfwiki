<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Label, Select, Button, Helper, A } from 'flowbite-svelte';

	import type { ApplicationDetail } from '$lib/api/application';
	import { fetchApplicationRounds, type ApplicationRoundListItem } from '$lib/api/applicationRound';
	import { filterRounds, formatRound } from '$lib/utils/applicationRoundUtils';
	import { buildQuery } from '$lib/api/api';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: ApplicationDetail;

	let rounds: ApplicationRoundListItem[] = [];

	const onRedirect = () => {
		const params = {
			year: entity.program_iteration.year,
			term: entity.program_iteration.term,
			application: entity.id
		};
		goto(`/program/${entity.program.id}/new-round/${buildQuery(params)}`);
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

<Label for="round" class="form-label">Round</Label>
<Select id="round" name="round" bind:value={$form.round} required>
	{#each filterRounds(rounds, entity.program_iteration.year, entity.program_iteration.term) as roundOption}
		<option value={roundOption.id}>{formatRound(roundOption)}</option>
	{/each}
</Select>
<Helper class="mt-4">
	If your desired round is not listed, <A on:click={onRedirect}>go to this page</A> and create it.
</Helper>

<Button type="submit" class="mt-8">Update</Button>
