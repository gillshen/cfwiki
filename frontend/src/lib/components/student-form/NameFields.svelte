<script lang="ts">
	import { Label, Input, Checkbox } from 'flowbite-svelte';
	import { names } from '$lib/constants/fake';

	export let form: any;
	const fakeName = names[Math.floor(Math.random() * names.length)];
</script>

<Label for="surname" class="form-label">Surname</Label>
<Input
	type="text"
	id="surname"
	name="surname"
	maxlength="100"
	bind:value={$form.surname}
	placeholder={fakeName.surname ?? ''}
	required
/>

<Label for="given-name" class="form-label">Given name</Label>
<Input
	type="text"
	id="given-name"
	name="given_name"
	maxlength="100"
	bind:value={$form.given_name}
	placeholder={fakeName.givenName ?? ''}
	required
/>

<Checkbox class="form-checkbox" name="surname_first" bind:checked={$form.surname_first}>
	Place the surname before the given name
</Checkbox>

<div class="mt-8">
	<Label for="preferred-name" class="form-label optional">Preferred name</Label>
	<Input
		type="text"
		id="preferred-name"
		name="preferred_name"
		maxlength="50"
		bind:value={$form.preferred_name}
	/>
</div>
