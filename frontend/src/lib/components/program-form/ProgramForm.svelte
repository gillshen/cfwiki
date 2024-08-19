<script lang="ts">
	import { Label, Input, Button, Helper } from 'flowbite-svelte';
	import type { Program } from '$lib/api/program';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: Program | null = null;

	// TODO
	if ($message || $errors) {
		//
	}

	$form.id = entity?.id;
	$form.type = entity?.type;
	$form.name = entity?.name;
	$form.degree = entity?.degree;
</script>

<Label for="name" class="form-label">Program name</Label>
<Input id="name" type="text" name="name" maxlength="100" bind:value={$form.name} />
{#if $form.type === 'UG Freshman' || $form.type === 'UG Transfer'}
	<Helper class="mt-2">
		For a UG Freshman/Transfer program, normally you should leave this field blank.
	</Helper>
{/if}

{#if $form.type === "Master's" || $form.type === 'Doctorate'}
	<Label for="degree" class="form-label">Degree awarded</Label>
	<Input id="degree" type="text" name="degree" maxlength="100" bind:value={$form.degree} required />
{/if}

<Button type="submit" class="mt-8">{entity ? 'Update' : 'Submit'}</Button>
