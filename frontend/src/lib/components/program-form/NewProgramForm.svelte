<script lang="ts">
	import { Label, Select, Checkbox } from 'flowbite-svelte';

	import type { School } from '$lib/api/school';
	import ProgramForm from '$lib/components/program-form/ProgramForm.svelte';
	import { programTypes } from '$lib/api/program';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: null;
	export let schools: School[];
	export let schoolId: number | '' = '';
	export let programType: string | '' = '';

	$: {
		$form.school_1 = schoolId;
		$form.type = programType;

		// Without this line $form.type doesn't get updated - no idea why
		console.log($form.type, entity);
	}

	let newProgramIsJoint: boolean = false;
</script>

<Label for="school-1" class="form-label">School</Label>
<Select id="school-1" name="school_1" bind:value={$form.school_1} required>
	{#each schools as school}
		<option value={school.id}>{school.name}</option>
	{/each}
</Select>

<Label for="program-type" class="form-label">Program type</Label>
<Select id="program-type" name="type" bind:value={$form.type} required>
	{#each programTypes as programTypeOption}
		<option value={programTypeOption}>{programTypeOption}</option>
	{/each}
</Select>

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
