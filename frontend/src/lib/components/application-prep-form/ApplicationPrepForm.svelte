<script lang="ts">
	import { Label, Select, Radio, Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	import type { StudentDetail } from '$lib/api/student';
	import { activeYears } from '$lib/utils/dateUtils';
	import { academicTerms } from '$lib/constants/progressions';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: StudentDetail;

	// TODO
	if ($message || $errors) {
		//
	}

	const applicationTypes = {
		freshman: 'UG Freshman',
		transfer: 'UG Transfer',
		graduate: 'Graduate',
		nondegree: 'Non-degree'
	};
</script>

<input type="number" name="student" value={entity.id} class="hidden" />

<Label for="contract" class="form-label">Contract</Label>
<Select id="contract" name="contract" bind:value={$form.contractId} required>
	{#each entity.contracts as contract}
		<option value={contract.id}>{contract.type} {contract.target_year}</option>
	{/each}
</Select>

<Label for="application-type" class="form-label">Application type</Label>
<Select id="application-type" name="type" bind:value={$form.type}>
	{#each Object.entries(applicationTypes) as [value, text]}
		<option {value}>{text}</option>
	{/each}
</Select>

<div class="grid grid-cols-2 gap-8">
	<div>
		<Label for="year" class="form-label">Year of admission</Label>
		<Select id="year" name="year" bind:value={$form.year} required>
			{#each activeYears() as yearOption}
				<option value={yearOption}>{yearOption}</option>
			{/each}
		</Select>
	</div>
</div>

<Label class="form-label">Term</Label>
<div class="grid grid-cols-1 mb-4 gap-2">
	{#each academicTerms as value}
		<Radio name="term" {value} class="form-radio" bind:group={$form.term} required>
			{value}
		</Radio>
	{/each}
</div>

<Button type="submit" class="mt-8 w-24">Next<ArrowRightOutline class="ms-1" /></Button>
