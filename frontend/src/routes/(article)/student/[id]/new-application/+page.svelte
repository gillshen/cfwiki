<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Label, Input, Button, Select, Radio, P, A, Helper, Hr } from 'flowbite-svelte';

	import { programTypes } from '$lib/api/program';
	import { activeYears } from '$lib/constants/dates';

	export let data;

	const { form, enhance } = superForm(data.newApplicationForm);

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

	const onProgramTypeChange = () => {
		$form.round_name = '';
		if (programType === 'UG Freshman') {
			roundNames = ['ED1', 'ED2', 'EA', 'REA', 'RD'];
		} else if (programType === 'UG Transfer') {
			roundNames = ['ED', 'RD'];
		} else {
			roundNames = ['Priority', 'Regular', 'Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5'];
		}
	};
</script>

<div class="w-[36rem] px-8 py-6">
	<form method="post" action="?/createApplication" use:enhance>
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
			<Select id="school" name="school" bind:value={schoolId} required>
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
			<Select id="program" name="program_id" bind:value={$form.program_id}>
				{#each programs as program}
					<option value={program.id}>{program.display_name}</option>
				{/each}
			</Select>
			<Helper class="mt-2">
				If you do not find your desired program listed, <A href="">click here</A>.
			</Helper>
		</div>

		<Hr />

		<div class="w-[30rem] px-6">
			<Label for="year" class="form-label">Year</Label>
			<Select id="year" name="year" bind:value={$form.year}>
				{#each activeYears as year}
					<option value={year}>{year}</option>
				{/each}
			</Select>

			<Label class="form-label">Term</Label>
			<div class="grid grid-cols-1 mb-4 gap-2">
				<Radio name="term" value="Fall" class="font-normal" bind:group={$form.term}>Fall</Radio>
				<Radio name="term" value="Spring" class="font-normal" bind:group={$form.term}>Spring</Radio>
				<Radio name="term" value="Summer" class="font-normal" bind:group={$form.term} required
					>Summer</Radio
				>
			</div>

			<Label for="round-name" class="form-label">Round</Label>
			<Select id="round-name" name="round_name" bind:value={$form.round_name} required>
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
