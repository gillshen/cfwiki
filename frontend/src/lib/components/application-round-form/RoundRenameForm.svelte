<script lang="ts">
	import { Label, Button, P, A, Input, Helper } from 'flowbite-svelte';

	export let form: any;
	export let redirectToRoundIdForm: () => void;
</script>

<div class="flex flex-col gap-2 mt-4">
	<P size="sm" color="text-gray-600">
		Renaming an admission plan will affect all applications under the plan. Do this only if you
		believe the current name is incorrect.
	</P>
	<P size="sm" color="text-gray-600">
		If you want to change the plan just for the current application,
		<A on:click={redirectToRoundIdForm}>click here</A>.
	</P>
</div>

<Label for="round-name" class="form-label">Name</Label>
<Input id="round-name" type="text" name="name" maxlength="50" bind:value={$form.name} required />
<Helper class="mt-2 form-helper">Such as "ED", "Round 1", or "Rolling"</Helper>

<Button type="submit" class="mt-8">Update</Button>
