<script lang="ts">
	import { Label, Button, Select, Heading } from 'flowbite-svelte';

	import { recognizedRankings, type SchoolRanking } from '$lib/api/ranking';
	import { activeYears } from '$lib/utils/dateUtils';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: SchoolRanking | null = null;
	export let name: string | null = null;

	$: {
		$form.id = entity?.id;
		$form.name = entity?.name ?? name;
		$form.year = entity?.year;
	}

	// TODO
	if ($errors || $message) {
	}
</script>

{#if entity === null && name === null}
	<Label for="name" class="form-label">Name</Label>
	<Select id="name" name="name" bind:value={$form.name} required>
		{#each Array.from(recognizedRankings) as nameOption}
			<option value={nameOption}>{nameOption}</option>
		{/each}
	</Select>
{:else}
	<Heading tag="h3" class="text-lg font-medium text-gray-700">{$form.name}</Heading>
	<input type="text" name="name" value={$form.name} class="hidden" />
{/if}

<Label for="year" class="form-label">Edition</Label>
<Select id="year" name="year" bind:value={$form.year} required>
	{#each activeYears().sort((a, b) => b - a) as yearOption}
		<option value={yearOption}>{yearOption}</option>
	{/each}
</Select>

<Button type="submit" class="mt-8">Submit</Button>
