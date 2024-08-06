<script lang="ts">
	import { Label, Input, Select, Textarea, Button } from 'flowbite-svelte';
	import { applicationStatuses, type ApplicationLog } from '$lib/api/applicationLog';

	export let form: any;
	export let log: ApplicationLog | null = null;

	$: if (log) {
		$form.id = log.id;
		$form.status = log.status;
		$form.date = log.date;
		$form.comments = log.comments;
	}
</script>

<input type="number" name="id" class="hidden" bind:value={$form.id} />

<Label for="new-log-status" class="form-label">Status</Label>
<Select id="new-log-status" name="status" bind:value={$form.status} required>
	{#each Array.from(applicationStatuses) as applicationStatus}
		<option value={applicationStatus}>{applicationStatus}</option>
	{/each}
</Select>

<Label for="new-log-date" class="form-label">Date</Label>
<Input id="new-log-date" type="date" name="date" bind:value={$form.date} required />

<Label for="new-log-comments" class="form-label optional">Comments</Label>
<Textarea id="new-log-comments" name="comments" rows="4" bind:value={$form.comments} />

<Button type="submit" class="mt-8">Submit</Button>
