<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { Heading, Hr, P, Label, Select, Radio } from 'flowbite-svelte';

	import type { ProgramDetail } from '$lib/api/program';
	import RoundForm from '$lib/components/application-round-form/RoundForm.svelte';
	import Toast from '$lib/components/misc/Toast.svelte';
	import { formatSchoolNames } from '$lib/utils/programUtils';
	import { activeYears } from '$lib/utils/dateUtils';
	import { academicTerms } from '$lib/constants/progressions';

	export let program: ProgramDetail;
	export let roundForm: SuperValidated<any>;
	export let action: string;
	export let year: number | any = null;
	export let term: string | any = null;

	let showToast = false;

	const { form, message, errors, enhance } = superForm(roundForm, {
		onUpdated({ form }) {
			if (!form.valid) {
				showToast = true;
			}
		}
	});

	if (typeof year === 'number') {
		$form.year = year;
	}
	if (typeof term === 'string') {
		$form.term = term;
	}
</script>

<Heading tag="h3" class="page-title">
	{$form.id ? 'Update' : 'Create an'} admission plan
</Heading>

<Hr />

<div class="max-w-prose mb-2">
	<P size="xl" weight="medium" class="text-gray-500 mb-1">{formatSchoolNames(program)}</P>
	<P size="base" weight="medium">{program.display_name}</P>
</div>

<div class="w-[30rem]">
	<form method="post" {action} use:enhance>
		<input type="number" name="program" value={program.id} class="hidden" />
		<input type="number" name="id" value={$form.id} class="hidden" />

		<div class="grid grid-cols-2 gap-x-8">
			<div>
				<Label for="year" class="form-label">Year</Label>
				<Select id="year" name="year" bind:value={$form.year} required>
					{#each activeYears() as yearOption}
						<option value={yearOption}>{yearOption}</option>
					{/each}
				</Select>
			</div>
		</div>

		<Label for="term" class="form-label">Term</Label>
		<div class="grid grid-cols-1 mb-4 gap-2">
			{#each academicTerms as value}
				<Radio name="term" {value} class="form-radio" bind:group={$form.term} required>
					{value}
				</Radio>
			{/each}
		</div>

		<Hr />

		<RoundForm {form} {message} {errors} />
	</form>

	{#if showToast}
		<Toast type="error" onClose={() => (showToast = false)}>
			Operation failed. Maybe you were trying to duplicate an existing admission plan?
		</Toast>
	{/if}
</div>
