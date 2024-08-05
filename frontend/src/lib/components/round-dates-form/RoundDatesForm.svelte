<script lang="ts">
	import { timeZones } from '$lib/constants/timeZones';
	import { Label, Input, Select, Hr, Button } from 'flowbite-svelte';

	export let form: any;
</script>

<div class="grid grid-cols-2 gap-x-4">
	<div>
		<Label for="due-date" class="form-label optional">Due date</Label>
		<Input id="due-date" type="date" name="due_date" bind:value={$form.due_date} />
	</div>
	<div>
		<Label for="due-time" class="form-label optional">Due time</Label>
		<Input id="due-time" type="time" name="due_time" bind:value={$form.due_time} />
	</div>
</div>

<Label for="timezone" class="form-label optional">Time zone</Label>
<Select id="timezone" name="timezone" bind:value={$form.timezone}>
	<option value=""></option>
	<option value="applicant">Applicant's local time</option>
	{#each Object.entries(timeZones) as [timeZone, timeZoneDescription]}
		<option value={timeZone}>{timeZoneDescription}</option>
	{/each}
</Select>

<Hr />

<div class="grid grid-cols-2 gap-x-4 -mt-8">
	<div>
		<Label for="decision-date" class="form-label optional">Decision date</Label>
		<Input id="decision-date" type="date" name="decision_date" bind:value={$form.decision_date} />
	</div>
</div>

<Button type="submit" class="mt-8">Update</Button>
