<script lang="ts">
	import { Label, Select, Input, Radio, Button, Hr } from 'flowbite-svelte';
	import { activeYears } from '$lib/utils/dateUtils';
	import { contractStatuses, contractTypes } from '$lib/api/contract';

	export let form: any;
	export let submitButtonText = 'Submit';
</script>

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
<div class="grid grid-cols-1 mb-4 gap-2">
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
	<Input
		id="student-progression"
		type="text"
		name="student_progression_when_signed"
		bind:value={$form.student_progression_when_signed}
	/>
</div>
<Hr />

<Button type="submit">{submitButtonText}</Button>
