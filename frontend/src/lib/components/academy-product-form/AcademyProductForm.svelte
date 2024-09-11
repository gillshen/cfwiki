<script lang="ts">
	import { Label, Button, Input } from 'flowbite-svelte';
	import type { AcademyProductListItem } from '$lib/api/academyProduct';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: AcademyProductListItem | null = null;

	$form.id = entity?.id;
	$form.name = entity?.name;

	// TODO
	if ($message || $errors) {
		//
	}
</script>

<input type="number" name="id" class="hidden" bind:value={$form.id} />

<Label for="name" class="form-label">Name</Label>
<Input id="name" type="text" name="name" maxlength="100" bind:value={$form.name} />

<Button type="submit" class="mt-8">{entity ? 'Update' : 'Submit'}</Button>
