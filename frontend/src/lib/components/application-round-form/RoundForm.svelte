<script lang="ts">
	import { Label, Button, Input, Helper } from 'flowbite-svelte';
	import DatesFields from '$lib/components/application-round-form/DatesFields.svelte';

	export let form: any;
	export let message: any;
	export let errors: any;

	// TODO
	if ($message || $errors) {
		//
	}
</script>

<Label for="name" class="form-label">Round name</Label>
<Input id="name" type="text" name="name" maxlength="50" bind:value={$form.name} required />
<Helper class="mt-2">Such as "ED", "Round 1", or "Rolling"</Helper>

<DatesFields {form} />

<Button type="submit" class="mt-8">Submit</Button>
