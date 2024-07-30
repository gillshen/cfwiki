<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		Label,
		Input,
		Select,
		Radio,
		Hr,
		Button
	} from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { activeYears } from '$lib/constants/dates';

	export let data;

	const { form, enhance } = superForm(data.newApplicationForm);

	const roundNames: string[] =
		data.program.type === 'UG Freshman'
			? ['ED1', 'ED2', 'EA1', 'EA2', 'REA', 'RD', 'Priority']
			: data.program.type === 'UG Transfer'
				? ['ED', 'RD']
				: ['Priority', 'Regular', 'Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5'];
</script>

<div class="w-[36rem] px-8 py-6">
	<Table noborder>
		<TableBody>
			<TableBodyRow>
				<TableBodyCell tdClass="w-32 font-medium px-6 py-4">Student</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{data.student.fullname}</TableBodyCell>
			</TableBodyRow>

			{#each data.program.schools as school}
				<TableBodyRow>
					<TableBodyCell tdClass="w-32 font-medium px-6 py-4">School</TableBodyCell>
					<TableBodyCell tdClass="font-normal">{school.name}</TableBodyCell>
				</TableBodyRow>
			{/each}

			<TableBodyRow>
				<TableBodyCell tdClass="w-32 font-medium px-6 py-4">Program</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{data.program.display_name}</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>

	<Hr />

	<form method="post" action="?/createApplication" use:enhance>
		<input type="number" name="student" class="hidden" value={data.student.id} />
		<input type="number" name="program" class="hidden" value={data.program.id} />

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

		<div class="w-[30rem] px-6 pt-8">
			<Button type="submit">Submit</Button>
		</div>
	</form>
</div>
