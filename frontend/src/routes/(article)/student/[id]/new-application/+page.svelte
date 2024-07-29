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
		Checkbox
	} from 'flowbite-svelte';

	import { programTypes } from '$lib/api/program';
	import { activeYears } from '$lib/constants/dates';
	import NameFields from '$lib/components/program-form/NameFields.svelte';

	export let data;

	const { form: newApplicationForm, enhance: newApplicationEnhance } = superForm(
		data.newApplicationForm
	);

	const { form: newProgramForm, enhance: newProgramEnhance } = superForm(data.newProgramForm, {
		onUpdated({ form }) {
			if (form.valid) {
				createProgramModal = false;
			}
		}
	});

	let schoolType = 'University';
	$: schools = data.schools
		.filter((a) => a.type === schoolType)
		.sort((a, b) => a.name.localeCompare(b.name));

	let schoolId = 0;

	let programType = '';
	$: programs = data.programs.filter((p) => {
		const schoolIds = p.schools.map((s) => s.id);
		return p.type === programType && schoolIds.includes(schoolId);
	});

	let roundNames: string[] = [];

	let createProgramModal = false;
	let newProgramIsJoint = false;

	const onSchoolChange = () => {
		programType = '';
		$newProgramForm.school_1 = schoolId;
		onProgramTypeChange();
	};

	const onProgramTypeChange = () => {
		$newApplicationForm.program_id = 0;
		$newApplicationForm.round_name = '';
		if (programType === 'UG Freshman') {
			roundNames = ['ED1', 'ED2', 'EA1', 'EA2', 'REA', 'RD', 'Priority'];
		} else if (programType === 'UG Transfer') {
			roundNames = ['ED', 'RD'];
		} else {
			roundNames = ['Priority', 'Regular', 'Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5'];
		}
	};
</script>

<div class="w-[36rem] px-8 py-6">
	<form method="post" action="?/createApplication" use:newApplicationEnhance>
		<input type="number" name="student" class="hidden" value={data.student.id} />

		<div class="w-[30rem] px-6">
			<Label for="student-name" class="form-label">Student</Label>
			<Input id="student-name" type="text" value={data.student.fullname} readonly />

			<Label class="form-label">School type</Label>
			<div class="form-radio-group">
				<Radio value="University" class="font-normal" bind:group={schoolType}>University</Radio>
				<Radio value="Secondary School" class="font-normal" bind:group={schoolType}
					>Secondary School</Radio
				>
				<Radio value="Other" class="font-normal" bind:group={schoolType} required>Other</Radio>
			</div>

			<Label for="school" class="form-label">School</Label>
			<Select id="school" name="school" bind:value={schoolId} on:change={onSchoolChange} required>
				{#each schools as school}
					<option value={school.id}>{school.name}</option>
				{/each}
			</Select>
			<Helper class="mt-2">
				If you do not find your desired school listed, <A href="">click here</A>.
			</Helper>
		</div>

		<Hr />

		<div class="w-[30rem] px-6">
			<Label for="program-type" class="form-label">Program type</Label>
			<Select id="program-type" bind:value={programType} on:change={onProgramTypeChange}>
				{#each programTypes as programTypeOption}
					<option value={programTypeOption}>{programTypeOption}</option>
				{/each}
			</Select>

			<Label for="program" class="form-label">Program</Label>
			<Select id="program" name="program_id" bind:value={$newApplicationForm.program_id}>
				{#each programs as program}
					<option value={program.id}>{program.display_name}</option>
				{/each}
			</Select>
			<Helper class="mt-2">
				If your desired program is not listed here, you may have to <A
					on:click={() => (createProgramModal = true)}>create it</A
				>.
			</Helper>
		</div>

		<Hr />

		<div class="w-[30rem] px-6">
			<Label for="year" class="form-label">Year</Label>
			<Select id="year" name="year" bind:value={$newApplicationForm.year}>
				{#each activeYears as year}
					<option value={year}>{year}</option>
				{/each}
			</Select>

			<Label class="form-label">Term</Label>
			<div class="grid grid-cols-1 mb-4 gap-2">
				<Radio name="term" value="Fall" class="font-normal" bind:group={$newApplicationForm.term}
					>Fall</Radio
				>
				<Radio name="term" value="Spring" class="font-normal" bind:group={$newApplicationForm.term}
					>Spring</Radio
				>
				<Radio
					name="term"
					value="Summer"
					class="font-normal"
					bind:group={$newApplicationForm.term}
					required>Summer</Radio
				>
			</div>

			<Label for="round-name" class="form-label">Round</Label>
			<Select
				id="round-name"
				name="round_name"
				bind:value={$newApplicationForm.round_name}
				required
			>
				{#each roundNames.length ? [...roundNames, 'Rolling'] : [] as roundName}
					<option value={roundName}>{roundName}</option>
				{/each}
			</Select>
		</div>

		<Hr />

		<div class="w-[30rem] px-6">
			<Button type="submit">Submit</Button>
		</div>
	</form>
</div>

<Modal title="Create a program" bind:open={createProgramModal} outsideclose>
	<form class="modal" method="post" action="?/createProgram" use:newProgramEnhance>
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

		{#if !['UG Freshman', 'UG Transfer'].includes($newProgramForm.type)}
			<NameFields form={newProgramForm} required />
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

		<Hr />

		<Button type="submit">Submit</Button>
	</form>
</Modal>
