<script lang="ts">
	import { Label, Input, Select, Checkbox } from 'flowbite-svelte';

	import type { School } from '$lib/api/school';
	import ProgramForm from '$lib/components/program-form/ProgramForm.svelte';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: null;
	export let school: School;
	export let schools: School[];
	export let programType: string | '' = '';

	$: {
		$form.school_1 = school.id;
		$form.type = programType;
		// Without this line $form.type doesn't get updated - no idea why
		console.log($form.type, entity);
	}

	let newProgramIsJoint: boolean = false;
</script>

<input type="number" name="school_1" value={school.id} class="hidden" />

<Label for="school-1" class="form-label">School</Label>
<Input id="school-1" type="text" class="form-input-readonly" bind:value={school.name} readonly />

<Label for="program-type" class="form-label">Program type</Label>
<Input
	id="program-type"
	type="text"
	name="type"
	class="form-input-readonly"
	bind:value={$form.type}
	readonly
/>

<Checkbox class="form-checkbox" bind:checked={newProgramIsJoint}>Is this a joint program?</Checkbox>

{#if newProgramIsJoint}
	<Label for="school-2" class="form-label">The other school</Label>
	<Select id="school-2" name="school_2" bind:value={$form.school_2} required>
		{#each schools as school}
			<option value={school.id}>{school.name}</option>
		{/each}
	</Select>
{/if}

<ProgramForm {form} {message} {errors} />
