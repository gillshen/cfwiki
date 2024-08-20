<script lang="ts">
	import { Label, Button, P, A, Input } from 'flowbite-svelte';

	export let form: any;
	export let redirectToRoundIdForm: () => void;
</script>

<div class="flex flex-col gap-2 mt-4">
	<P size="sm" color="text-gray-600">
		Renaming an application round will affect all applications targeting it. Do this only if you
		believe the current name is incorrect.
	</P>
	<P size="sm" color="text-gray-600">
		If you are trying to move the application to another round,
		<A on:click={redirectToRoundIdForm}>click here</A>.
	</P>
</div>

<Label for="round-name" class="form-label">Name</Label>
<Input id="round-name" type="text" name="name" maxlength="50" bind:value={$form.name} required />

<Button type="submit" class="mt-8">Update</Button>
