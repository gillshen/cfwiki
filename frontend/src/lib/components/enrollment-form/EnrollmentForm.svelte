<script lang="ts">
	import { Label, Select, Radio, Button, Input } from 'flowbite-svelte';
	import type { Enrollment } from '$lib/api/student';
	import type { School } from '$lib/api/school';

	export let form: any;
	export let schools: School[];
	export let enrollment: Enrollment | null = null;
	export let submitButtonText: string = 'Submit';

	$form.id = enrollment?.id;
	$form.school = enrollment?.school.id;
	$form.program_type = enrollment?.program_type;
	$form.start_date = enrollment?.start_date;
	$form.start_progression = enrollment?.start_progression;
	$form.end_date = enrollment?.end_date;
	$form.end_progression = enrollment?.end_progression;
	$form.curriculum = enrollment?.curriculum;

	const secondarySchoolCurricula = ['', 'A-level', 'AP', 'IB', 'Other'];

	let schoolType = enrollment?.school.type;

	const onSchoolTypeChange = () => {
		$form.school = '';
	};

	$: filteredSchools = schools
		.filter((s) => s.type === schoolType)
		.sort((a, b) => a.name.localeCompare(b.name));

	let progressions: string[] = [];

	const onProgramTypeChange = () => {
		if ($form.program_type === 'Secondary School') {
			progressions = ['G9', 'G10', 'G11', 'G12'];
		} else {
			progressions = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
		}
	};

	onProgramTypeChange();
</script>

<input type="number" name="id" class="hidden" bind:value={$form.id} />

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
<Select id="school" name="school" bind:value={$form.school} required>
	{#each filteredSchools as school}
		<option value={school.id}>{school.name}</option>
	{/each}
</Select>

<Label for="program-type" class="form-label">Program type</Label>
<Select
	id="program-type"
	name="program_type"
	bind:value={$form.program_type}
	on:change={onProgramTypeChange}
	required
>
	{#each ['Secondary School', 'UG Freshman', 'UG Transfer', "Master's"] as programType}
		<option value={programType}>{programType}</option>
	{/each}
</Select>

<div class="grid grid-cols-2 gap-x-8">
	<div>
		<Label for="start-date" class="form-label">Start date</Label>
		<Input id="start-date" type="date" name="start_date" bind:value={$form.start_date} required />
	</div>
	<div>
		<Label for="start-progression" class="form-label optional">Starting progression</Label>
		<Select id="start-progression" name="start_progression" bind:value={$form.start_progression}>
			{#each progressions as progression}
				<option value={progression}>{progression}</option>
			{/each}
		</Select>
	</div>

	<div>
		<Label for="end-date" class="form-label optional">End date</Label>
		<Input id="end-date" type="date" name="end_date" bind:value={$form.end_date} />
	</div>
	<div>
		<Label for="end-progression" class="form-label optional">Terminal progression</Label>
		<Select id="end-progression" name="end_progression" bind:value={$form.end_progression}>
			{#each progressions as progression}
				<option value={progression}>{progression}</option>
			{/each}
		</Select>
	</div>
</div>

{#if $form.program_type === 'Secondary School'}
	<Label for="curriculum" class="form-label optional">Curriculum</Label>
	<Select id="curriculum" name="curriculum" bind:value={$form.curriculum}>
		{#each secondarySchoolCurricula as curriculum}
			<option value={curriculum}>{curriculum}</option>
		{/each}
	</Select>
{:else}
	<Label for="curriculum" class="form-label optional">Major</Label>
	<Input id="curriculum" type="text" name="curriculum" bind:value={$form.curriculum} />
{/if}

<Button type="submit" class="mt-8">{submitButtonText}</Button>
