<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import {
		Label,
		Input,
		Button,
		Select,
		Radio,
		A,
		Helper,
		Hr,
		Modal,
		Checkbox,
		Heading
	} from 'flowbite-svelte';

	import { programTypes } from '$lib/api/program';
	import NameFields from '$lib/components/program-form/NameFields.svelte';

	export let data;

	const { form: newProgramForm, enhance: newProgramEnhance } = superForm(data.newProgramForm, {
		onUpdated({ form }) {
			if (form.valid) {
				createProgramModal = false;
			}
		}
	});

	let schoolId: number | string = '';
	let programId: number | string = '';

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
	let newProgramIsJoint = false;

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

	const onOpenNewProgramForm = () => {
		$newProgramForm.school_1 = typeof schoolId === 'number' ? schoolId : 0;
		$newProgramForm.type = programType;
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

		<Label class="form-label">School type</Label>
		<div class="form-radio-group">
			<Radio
				value="University"
				class="font-normal"
				bind:group={schoolType}
				on:change={onSchoolTypeChange}>University</Radio
			>
			<Radio
				value="Secondary School"
				class="font-normal"
				bind:group={schoolType}
				on:change={onSchoolTypeChange}>Secondary School</Radio
			>
			<Radio
				value="Other"
				class="font-normal"
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
		<Helper class="mt-2">
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
				<option value={program.id}>{program.display_name}</option>
			{/each}
		</Select>
		<Helper class="mt-2">
			If your desired program is not listed, <A on:click={onOpenNewProgramForm}>click here</A> to create
			it.
		</Helper>

		<Hr />

		<Button type="submit">Next</Button>
	</form>
</div>

<Modal title="Create a program" bind:open={createProgramModal} outsideclose>
	<form class="modal" method="post" action="?/createProgram" use:newProgramEnhance>
		<div class="form-width mx-auto">
			<Label for="school-1" class="form-label">School</Label>
			<Select id="school-1" name="school_1" bind:value={$newProgramForm.school_1} required>
				{#each schools as school}
					<option value={school.id}>{school.name}</option>
				{/each}
			</Select>

			<Label for="new-program-type" class="form-label">Program type</Label>
			<Select id="new-program-type" name="type" bind:value={$newProgramForm.type} required>
				{#each programTypes as programTypeOption}
					<option value={programTypeOption}>{programTypeOption}</option>
				{/each}
			</Select>

			{#if $newProgramForm.type === "Master's" || $newProgramForm.type === 'PhD'}
				<NameFields form={newProgramForm} requireDegree />
			{:else if $newProgramForm.type === 'Other'}
				<NameFields form={newProgramForm} />
			{/if}

			<Checkbox class="form-checkbox" bind:checked={newProgramIsJoint}>
				Is this a joint program?
			</Checkbox>

			{#if newProgramIsJoint}
				<Label for="school-2" class="form-label">The other school</Label>
				<Select id="school-2" name="school_2" bind:value={$newProgramForm.school_2} required>
					{#each schools as school}
						<option value={school.id}>{school.name}</option>
					{/each}
				</Select>
			{/if}

			<Button type="submit" class="mt-8">Submit</Button>
		</div>
	</form>
</Modal>
