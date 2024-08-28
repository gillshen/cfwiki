<script lang="ts">
	import { Button, Input, Label, Select, Radio } from 'flowbite-svelte';

	import type { School } from '$lib/api/school';
	import countryFlags, { sortMostAppliedFirst } from '$lib/constants/countryFlags';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: School | null = null;

	$form.id = entity?.id;
	$form.type = entity?.type;
	$form.name = entity?.name;
	$form.alt_name = entity?.alt_name;
	$form.country = entity?.country;

	// TODO
	if ($message || $errors) {
		//
	}

	const countries = Object.keys(countryFlags).sort(sortMostAppliedFirst);
</script>

<Label for="school-type" class="form-label">Type</Label>
<div class="form-radio-group">
	{#each ['University', 'Secondary School', 'Other'] as schoolType}
		<Radio name="type" value={schoolType} class="form-radio" bind:group={$form.type} required
			>{schoolType}</Radio
		>
	{/each}
</div>

<Label for="school-name" class="form-label">Full name</Label>
<Input id="school-name" type="text" name="name" maxlength="100" bind:value={$form.name} required />

<Label for="school-alt-name" class="form-label optional">Abbreviation or nickname</Label>
<Input
	id="school-alt-name"
	type="text"
	name="alt_name"
	maxlength="20"
	bind:value={$form.alt_name}
/>

<Label for="school-country" class="form-label">Country</Label>
<Select id="school-country" name="country" bind:value={$form.country} required>
	{#each countries as country}
		<option value={country}>{countryFlags[country]}&nbsp;&nbsp;{country}</option>
	{/each}
</Select>

<Button class="mt-8" type="submit">{entity ? 'Update' : 'Submit'}</Button>
