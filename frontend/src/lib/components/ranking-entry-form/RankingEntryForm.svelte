<script lang="ts">
	import { Label, Button, Input, Select, P, Heading } from 'flowbite-svelte';

	import type { SchoolRanking, SchoolRankingEntry } from '$lib/api/ranking';
	import type { School } from '$lib/api/school';
	import { orderByName } from '$lib/utils/schoolUtils';
	import { activeYears } from '$lib/utils/dateUtils';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let schools: School[];

	// For updating an existing entry
	export let entity: SchoolRankingEntry | null = null;
	// For creating a new entry
	export let ranking: SchoolRanking | null = null;
	export let year: number | null = null;

	$: {
		$form.id = entity?.id;
		$form.ranking = entity?.ranking.id ?? ranking?.id;
		$form.school = entity?.school.id;
		$form.year = entity?.year ?? year;
		$form.rank = entity?.rank;
	}

	// TODO
	if ($message || $errors) {
	}
</script>

<input type="number" name="id" class="hidden" bind:value={$form.id} />
<input type="number" name="ranking" class="hidden" bind:value={$form.ranking} />

{#if entity !== null || year !== null}
	<input type="number" name="year" class="hidden" bind:value={$form.year} />
{:else}
	<Heading tag="h4" class="text-lg font-medium">{ranking?.name}</Heading>

	<div class="grid grid-cols-2 gap-x-8">
		<div>
			<Label for="year" class="form-label">Year</Label>
			<Select id="year" name="year" bind:value={$form.year} required>
				{#each activeYears().sort((a, b) => b - a) as yearOption}
					<option value={yearOption}>{yearOption}</option>
				{/each}
			</Select>
		</div>
	</div>

	<P size="sm" class="mt-8 text-gray-700">
		Add the first ranking entry below. After you hit &ldquo;Submit&rdquo;, you will be redirected to
		a page where you can add more entries.
	</P>
{/if}

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
