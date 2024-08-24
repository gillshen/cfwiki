<script lang="ts">
	import { Label, Input, Button, Select, Radio, A, Helper, Hr, Heading } from 'flowbite-svelte';

	import { programTypes } from '$lib/api/program';
	import { enhanceDisplayName } from '$lib/utils/programUtils';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import NewProgramForm from '$lib/components/program-form/NewProgramForm.svelte';

	export let data;

	let schoolId: number | '' = '';
	let programId: number | '' = '';

	let schoolType = 'University';

	$: schools = data.schools
		.filter((a) => a.type === schoolType)
		.sort((a, b) => a.name.localeCompare(b.name));

	let programType = '';

	$: programs = data.programs.filter((p) => {
		const schoolIds = p.schools.map((s) => s.id);
		return p.type === programType && typeof schoolId === 'number' && schoolIds.includes(schoolId);
	});

	let createProgramModal = false;

	const onSchoolTypeChange = () => {
		schoolId = '';
		onSchoolChange();
	};

	const onSchoolChange = () => {
		programType = '';
		onProgramTypeChange();
	};

	const onProgramTypeChange = () => {
		programId = '';
	};

	const openModal = () => {
		createProgramModal = true;
	};
</script>

<Heading tag="h3" class="page-title">Create an application</Heading>

<Hr />

<div class="form-width">
	<form method="post" action="?/gotoCreateApplication">
		<input type="number" name="student" class="hidden" value={data.student.id} />

		<Label for="student-name" class="form-label">Student</Label>
		<Input id="student-name" type="text" value={data.student.fullname} readonly />

		<Label for="contract" class="form-label">Contract</Label>
		<Select id="contract" name="contract" required>
			{#each data.student.contracts_sorted as contract}
				<option value={contract.id}>{contract.type} {contract.target_year}</option>
			{/each}
		</Select>

		<Label class="form-label">School type</Label>
		<div class="form-radio-group">
			<Radio
				value="University"
				class="form-radio"
				bind:group={schoolType}
				on:change={onSchoolTypeChange}>University</Radio
			>
			<Radio
				value="Secondary School"
				class="form-radio"
				bind:group={schoolType}
				on:change={onSchoolTypeChange}>Secondary School</Radio
			>
			<Radio
				value="Other"
				class="form-radio"
				bind:group={schoolType}
				on:change={onSchoolTypeChange}
				required>Other</Radio
			>
		</div>

		<Label for="school" class="form-label">School</Label>
		<Select id="school" name="school" bind:value={schoolId} on:change={onSchoolChange} required>
			{#each schools as school}
				<option value={school.id}>{school.name}</option>
			{/each}
		</Select>
		<Helper class="mt-2 form-helper">
			If your desired school is not listed, <A href="/school/new">go to this page</A> and create it.
		</Helper>

		<Hr />

		<Label for="program-type" class="form-label">Program type</Label>
		<Select id="program-type" bind:value={programType} on:change={onProgramTypeChange} required>
			{#each programTypes as programTypeOption}
				<option value={programTypeOption}>{programTypeOption}</option>
			{/each}
		</Select>

		<Label for="program" class="form-label">Program</Label>
		<Select id="program" name="program" bind:value={programId} required>
			{#each programs as program}
				<option value={program.id}>{enhanceDisplayName(program)}</option>
			{/each}
		</Select>
		<Helper class="mt-2 form-helper">
			If your desired program is not listed, <A on:click={openModal}>click here</A> to create it.
		</Helper>

		<Button type="submit" class="mt-8">Next</Button>
	</form>
</div>

<FormModal
	open={createProgramModal}
	superform={data.newProgramForm}
	fields={NewProgramForm}
	action="?/createProgram"
	title="Create a program"
	{schools}
	{schoolId}
	{programType}
	on:close={() => (createProgramModal = false)}
/>
