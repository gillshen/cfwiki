<script lang="ts">
	import { Label, Select, Input, Radio, Button } from 'flowbite-svelte';
	import { activeYears } from '$lib/utils/dateUtils';
	import { contractStatuses, contractTypes, type Contract } from '$lib/api/contract';
	import { allProgressionsT } from '$lib/constants/progressions';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: Contract | null = null;

	// TODO
	if ($message || $errors) {
		//
	}

	$form.id = entity?.id;
	$form.type = entity?.type;
	$form.target_year = entity?.target_year;
	$form.status = entity?.status;
	$form.date = entity?.date;
	$form.student_progression_when_signed = entity?.student_progression_when_signed;
</script>

<input type="number" name="id" class="hidden" bind:value={$form.id} />

<Label for="contract-type" class="form-label">Contract type</Label>
<Select id="contract-type" name="type" bind:value={$form.type} required>
	{#each contractTypes as contractType}
		<option value={contractType}>{contractType}</option>
	{/each}
</Select>

<Label for="target-year" class="form-label">Target year</Label>
<Select id="target-year" name="target_year" bind:value={$form.target_year} required>
	{#each activeYears() as year}
		<option value={year}>{year}</option>
	{/each}
</Select>

<Label class="form-label">Contract status</Label>
<div class="grid grid-cols-1 gap-2">
	{#each contractStatuses as contractStatus}
		<Radio
			name="status"
			value={contractStatus}
			class="font-normal"
			bind:group={$form.status}
			required>{contractStatus}</Radio
		>
	{/each}

	<Label for="contract-date" class="form-label optional">Date signed</Label>
	<Input id="contract-date" type="date" name="date" bind:value={$form.date} />

	<Label for="student-progression" class="form-label optional"
		>Student progression when signed</Label
	>
	<Select
		id="student-progression"
		name="student_progression_when_signed"
		bind:value={$form.student_progression_when_signed}
	>
		<option value=""></option>
		{#each allProgressionsT as progression}
			<option value={progression}>{progression}</option>
		{/each}
	</Select>
</div>

<Button type="submit" class="mt-8">{entity ? 'Update' : 'Submit'}</Button>
