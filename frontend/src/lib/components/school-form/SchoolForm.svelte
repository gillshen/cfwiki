<script lang="ts">
	import { Button, Input, Label, Select } from 'flowbite-svelte';
	import countryFlags, { sortMostAppliedFirst } from '$lib/constants/countryFlags';

	export let form: any;
	export let submitButtonText = 'Submit';

	const countries = Object.keys(countryFlags).sort(sortMostAppliedFirst);
</script>

<div class="w-[30rem] px-6">
	<Label for="school-name" class="form-label">Full name</Label>
	<Input id="school-name" type="text" name="name" bind:value={$form.name} required />

	<Label for="school-alt-name" class="form-label optional">Abbreviation or nickname</Label>
	<Input id="school-alt-name" type="text" name="alt_name" bind:value={$form.alt_name} />

	<Label for="school-type" class="form-label">Type</Label>
	<Select id="school-type" name="type" bind:value={$form.type} required>
		{#each ['University', 'Secondary School', 'Other'] as schoolType}
			<option value={schoolType}>{schoolType}</option>
		{/each}
	</Select>

	<Label for="school-country" class="form-label">Country</Label>
	<Select id="school-country" name="country" bind:value={$form.country} required>
		{#each countries as country}
			<option value={country}>{countryFlags[country]}&nbsp;&nbsp;{country}</option>
		{/each}
	</Select>

	<div class="mt-8">
		<Button type="submit">{submitButtonText}</Button>
	</div>
</div>
