<script lang="ts">
	import { Label, Select, Button, P, A } from 'flowbite-svelte';

	import { getRoundNames } from '$lib/constants/applicationRounds';

	export let form: any;
	export let programType: string;
	export let redirectToRoundIdForm: () => void;
</script>

<div class="flex flex-col gap-2 mt-4">
	<P size="sm" color="text-gray-600">
		Renaming an application round will affect all applications targeting it. Do this only if you
		believe the current name is incorrect.
	</P>
	<P size="sm" color="text-gray-600">
		If you are trying to <strong>move</strong> the application to another round,
		<A on:click={redirectToRoundIdForm}>click here</A>.
	</P>
</div>

<Label for="round-name" class="form-label">Name</Label>
<Select id="round-name" name="name" bind:value={$form.name} required>
	{#each getRoundNames(programType) as roundName}
		<option value={roundName}>{roundName}</option>
	{/each}
</Select>

<Button type="submit" class="mt-8">Update</Button>
