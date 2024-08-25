<script lang="ts">
	import { Label, Select, Input, Button } from 'flowbite-svelte';
	import type { Service } from '$lib/api/contract';
	import type { CfUserListItem } from '$lib/api/user';
	import { cfRoles } from '$lib/api/service';

	export let form: any;
	export let cfers: CfUserListItem[];
	export let errors: any;
	export let message: any;
	export let entity: Service | null = null;

	if ($message || $errors) {
		// TODO
	}

	$form.id = entity?.id;
	$form.cfer = entity?.cfer;
	$form.role = entity?.role;
	$form.start_date = entity?.start_date;
	$form.end_date = entity?.end_date;
</script>

<input type="number" name="id" class="hidden" bind:value={$form.id} />

<Label for="cfer" class="form-label">CF Person</Label>
<Select id="cfer" name="cfer" bind:value={$form.cfer} required>
	{#each cfers.sort((a, b) => a.username.localeCompare(b.username)) as cfer}
		<option value={cfer.id}>{cfer.username}</option>
	{/each}
</Select>

<Label for="role" class="form-label">Role</Label>
<Select id="role" name="role" bind:value={$form.role} required>
	{#each Array.from(cfRoles) as role}
		<option value={role}>{role}</option>
	{/each}
</Select>

<Label for="start-date" class="form-label optional">Start date</Label>
<Input id="start-date" type="date" name="start_date" bind:value={$form.start_date} />

<Label for="end-date" class="form-label optional">End date</Label>
<Input id="end-date" type="date" name="end_date" bind:value={$form.end_date} />

<Button type="submit" class="mt-8">{entity ? 'Update' : 'Submit'}</Button>
