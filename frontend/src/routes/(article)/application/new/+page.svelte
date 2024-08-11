<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		Label,
		Select,
		Radio,
		Hr,
		Button,
		Heading
	} from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { activeYears } from '$lib/utils/dateUtils';
	import { getRoundNames } from '$lib/constants/applicationRounds.js';
	import { academicTerms } from '$lib/constants/progressions';

	export let data;

	const { form, enhance } = superForm(data.newApplicationForm);
</script>

<Heading tag="h3">Create an application</Heading>

<Hr />

<div class="w-[30rem]">
	<Table noborder>
		<TableBody>
			<TableBodyRow>
				<TableBodyCell tdClass="w-32 font-medium py-3">Student</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{data.contract.student_name}</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-32 font-medium py-3">Contract</TableBodyCell>
				<TableBodyCell tdClass="font-normal"
					>{data.contract.type} {data.contract.target_year}</TableBodyCell
				>
			</TableBodyRow>

			{#each data.program.schools.sort((a, b) => a.name.localeCompare(b.name)) as school, index}
				<TableBodyRow>
					<TableBodyCell tdClass="w-32 font-medium py-3">
						School{data.program.schools.length > 1 ? ` ${index + 1}` : ''}
					</TableBodyCell>
					<TableBodyCell tdClass="font-normal">{school.name}</TableBodyCell>
				</TableBodyRow>
			{/each}

			<TableBodyRow>
				<TableBodyCell tdClass="w-32 font-medium py-3">Program</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{data.program.display_name}</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>

	<Hr />

	<form method="post" action="?/createApplication" use:enhance>
		<input type="number" name="contract" class="hidden" value={data.contract.id} />
		<input type="number" name="program" class="hidden" value={data.program.id} />

		<div class="form-width">
			<Label for="year" class="form-label">Year</Label>
			<Select id="year" name="year" bind:value={$form.year} required>
				{#each activeYears() as year}
					<option value={year}>{year}</option>
				{/each}
			</Select>

			<Label class="form-label">Term</Label>
			<div class="grid grid-cols-1 mb-4 gap-2">
				{#each academicTerms as value}
					<Radio name="term" {value} class="font-normal" bind:group={$form.term} required>
						{value}
					</Radio>
				{/each}
			</div>

			<Label for="round-name" class="form-label">Round</Label>
			<Select id="round-name" name="round_name" bind:value={$form.round_name} required>
				{#each getRoundNames(data.program.type) as roundName}
					<option value={roundName}>{roundName}</option>
				{/each}
			</Select>

			<Button type="submit" class="mt-8">Submit</Button>
		</div>
	</form>
</div>
