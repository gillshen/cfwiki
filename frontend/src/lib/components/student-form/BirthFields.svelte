<script lang="ts">
	import { Label, Radio, Select, Input } from 'flowbite-svelte';
	import countryFlags, { sortChinaUnitedStatesFirst } from '$lib/constants/countryFlags';

	export let form: any;

	const countries = Object.keys(countryFlags).sort(sortChinaUnitedStatesFirst);
</script>

<Label class="form-label">Gender</Label>
<div class="grid grid-cols-1 mb-4 gap-2">
	<Radio name="gender" value="female" class="form-radio" bind:group={$form.gender}>Female</Radio>
	<Radio name="gender" value="male" class="form-radio" bind:group={$form.gender}>Male</Radio>
	<Radio name="gender" value="other" class="form-radio" bind:group={$form.gender} required
		>Other</Radio
	>
</div>

<Label for="citizenship" class="form-label">Citizenship</Label>
<Select id="citizenship" name="citizenship" bind:value={$form.citizenship} required>
	{#each countries as country}
		<option value={country}>{countryFlags[country]}&nbsp;&nbsp;{country}</option>
	{/each}
</Select>

<Label for="date-of-birth" class="form-label optional">Date of birth</Label>
<Input type="date" id="date-of-birth" name="date_of_birth" bind:value={$form.date_of_birth} />
