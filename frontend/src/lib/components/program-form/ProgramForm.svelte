<script lang="ts">
	import { Label, Input, Button, Helper, Checkbox } from 'flowbite-svelte';
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
	$form.is_defunct = entity?.is_defunct;

	$: isUndergraduate = $form.type === 'UG Freshman' || $form.type === 'UG Transfer';
	$: isGraduate = $form.type === "Master's" || $form.type === 'Doctorate';
</script>

<Label for="name" class={isUndergraduate ? 'form-label optional' : 'form-label'}>
	Program name
</Label>
<Input
	id="name"
	type="text"
	name="name"
	maxlength="100"
	bind:value={$form.name}
	required={!isUndergraduate}
/>
{#if isUndergraduate}
	<Helper class="mt-2 form-helper">
		For an undergraduate program, normally you should leave this field blank &mdash; unless the host
		school runs multiple such programs that need to be distinguished by name.
	</Helper>
{/if}

{#if isGraduate}
	<Label for="degree" class="form-label">Degree awarded</Label>
	<Input id="degree" type="text" name="degree" maxlength="100" bind:value={$form.degree} required />
	<Helper class="mt-2 form-helper">
		Use abbreviations if applicable; e.g. &ldquo;MS&rdquo; instead of &ldquo;Master of
		Science&rdquo;.
	</Helper>
{/if}

{#if entity}
	<Checkbox name="is_defunct" class="form-checkbox" bind:checked={$form.is_defunct}>
		This program is defunct
	</Checkbox>
{/if}

<Button type="submit" class="mt-8">{entity ? 'Update' : 'Submit'}</Button>
