<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

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
		Heading,
		Helper,
		A
	} from 'flowbite-svelte';

	import Toast from '$lib/components/misc/Toast.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import RoundForm from '$lib/components/application-round-form/RoundForm.svelte';
	import { activeYears } from '$lib/utils/dateUtils';
	import { academicTerms } from '$lib/constants/progressions';
	import { filterRounds, formatRound } from '$lib/utils/applicationRoundUtils';

	export let data;

	const { form, enhance } = superForm(data.newApplicationForm, {
		onUpdated({ form }) {
			if (!form.valid) {
				showToast = true;
			}
		}
	});

	let year: number | null = null;
	let term: string = '';

	let roundModal = false;
	let showToast = false;
</script>

<Heading tag="h3" class="page-title">Create an application</Heading>

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
				<TableBodyCell tdClass="font-normal">
					{data.contract.type}
					{data.contract.target_year}
				</TableBodyCell>
			</TableBodyRow>

			{#each data.program.schools.sort((a, b) => a.name.localeCompare(b.name)) as school, index}
				<TableBodyRow>
					<TableBodyCell tdClass="w-32 font-medium py-3">
						{data.program.schools.length > 1 ? `School ${index + 1}` : 'School'}
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
			<div class="grid grid-cols-2 gap-8">
				<div>
					<Label for="year" class="form-label">Year</Label>
					<Select id="year" name="year" bind:value={year} required>
						{#each activeYears() as yearOption}
							<option value={yearOption}>{yearOption}</option>
						{/each}
					</Select>
				</div>
			</div>

			<Label class="form-label">Term</Label>
			<div class="grid grid-cols-1 mb-4 gap-2">
				{#each academicTerms as value}
					<Radio name="term" {value} class="form-radio" bind:group={term} required>
						{value}
					</Radio>
				{/each}
			</div>

			<Label for="round" class="form-label">Round</Label>
			<Select id="round" name="round" bind:value={$form.round} required>
				{#each filterRounds(data.applicationRounds, year, term) as applRound}
					<option value={applRound.id}>{formatRound(applRound)}</option>
				{/each}
			</Select>
			{#if year && term}
				<Helper class="mt-2">
					If your desired round is not listed, <A on:click={() => (roundModal = true)}>click here</A
					> to create it.
				</Helper>
			{/if}

			<Button type="submit" class="mt-8">Submit</Button>
		</div>
	</form>
</div>

<FormModal
	open={roundModal}
	superform={data.newApplicationRoundForm}
	fields={RoundForm}
	action="?/createApplicationRound"
	title="Create an application round"
	extra={[
		{ name: 'program', type: 'number', value: data.program.id },
		{ name: 'year', type: 'number', value: year },
		{ name: 'term', type: 'text', value: term }
	]}
	on:close={() => (roundModal = false)}
/>

{#if showToast}
	<Toast type="error" onClose={() => (showToast = false)}>
		Operation failed. Maybe the application you were trying to create already exists.
	</Toast>
{/if}
