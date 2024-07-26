<script lang="ts">
	import { Label, Select, Input, Button, Hr } from 'flowbite-svelte';

	export let form: any;
	export let submitButtonText = 'Submit';
</script>

<div class="w-[30rem] px-8">
	<Label for="contract-type" class="form-label">Contract type</Label>
	<Select id="contract-type" name="type" bind:value={$form.type}>
		{#each ['UG Freshman', 'UG Transfer', "Master's", 'PhD'] as contractType}
			<option value={contractType}>{contractType}</option>
		{/each}
	</Select>

	<Label for="target-year" class="form-label">Target year</Label>
	<Select id="target-year" name="target_year" bind:value={$form.target_year}>
		{#each [2021, 2022, 2023, 2024, 2025, 2026, 2027] as year}
			<option value={year}>{year}</option>
		{/each}
	</Select>

	<Label for="contract-status" class="form-label">Contract status</Label>
	<Select id="contract-status" name="status" bind:value={$form.status}>
		{#each ['In effect', 'Fulfilled', 'Terminated'] as contractStatus}
			<option value={contractStatus}>{contractStatus}</option>
		{/each}
	</Select>

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
<div class="w-[30rem] px-8">
	<Button type="submit">{submitButtonText}</Button>
</div>
