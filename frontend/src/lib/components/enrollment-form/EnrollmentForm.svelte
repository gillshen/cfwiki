<script lang="ts">
	import { onMount } from 'svelte';
	import { Label, Select, Radio, Button, Input, Helper, A } from 'flowbite-svelte';

	import type { EnrollmentByStudent } from '$lib/api/enrollment';
	import type { School } from '$lib/api/school';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: EnrollmentByStudent | null = null;
	export let promisedSchools: Promise<School[]>;

	// TODO
	if ($message || $errors) {
		//
	}

	const secondarySchoolCurricula = ['', 'A-level', 'AP', 'IB', 'Other'];

	let schools: School[] = [];
	let schoolType = entity?.school.type ?? 'University';

	const onSchoolTypeChange = () => ($form.school = '');

	$: filteredSchools = schools
		.filter((s) => s.type === schoolType)
		.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));

	let progressions: string[] = [];

	const defaultProgressions = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
	const secondarySchoolProgressions = ['G9', 'G10', 'G11', 'G12'];

	$: progressions =
		$form.program_type === 'Secondary School' ? secondarySchoolProgressions : defaultProgressions;

	onMount(async () => {
		if (!entity) {
			schools = await promisedSchools;
			$form.school = '';
		}
		if (entity) {
			$form.id = entity.id;
			$form.school = entity.school.id;
			$form.program_type = entity.program_type;
			$form.start_date = entity.start_date;
			$form.start_progression = entity.start_progression;
			$form.end_date = entity.end_date;
			$form.end_progression = entity.end_progression;
			$form.curriculum = entity.curriculum;
		}
	});
</script>

<input type="number" name="id" class="hidden" bind:value={$form.id} />

{#if !entity}
	<Label class="form-label">School type</Label>
	<div class="form-radio-group">
		{#each ['University', 'Secondary School', 'Other'] as schoolTypeOption}
			<Radio
				value={schoolTypeOption}
				class="form-radio"
				bind:group={schoolType}
				on:change={onSchoolTypeChange}
				required>{schoolTypeOption}</Radio
			>
		{/each}
	</div>

	<Label for="school" class="form-label">School</Label>
	<Select id="school" name="school" bind:value={$form.school} required>
		{#each filteredSchools as schoolOption}
			<option value={schoolOption.id}>{schoolOption.name}</option>
		{/each}
	</Select>
	<Helper class="mt-2 form-helper">
		If your desired school is not listed, <A href="/school/new">create it here</A> and then come back
		to this page.
	</Helper>
{:else}
	<input name="school" type="number" class="hidden" bind:value={entity.school.id} />
{/if}

<Label for="program-type" class="form-label">Program type</Label>
<Select id="program-type" name="program_type" bind:value={$form.program_type} required>
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
			<option value=""></option>
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
	<Label for="curriculum" class="form-label optional">Majors and minors</Label>
	<Input
		id="curriculum"
		type="text"
		name="curriculum"
		maxlength="100"
		bind:value={$form.curriculum}
	/>
{/if}

<Button type="submit" class="mt-8">{entity ? 'Update' : 'Submit'}</Button>
