<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Button, A, Label, Select, Helper, Modal } from 'flowbite-svelte';
	import { ChevronDoubleRightOutline, InfoCircleOutline } from 'flowbite-svelte-icons';

	import type { School } from '$lib/api/school';
	import type { ProgramListItem } from '$lib/api/program';
	import type { ApplicationRoundListItem } from '$lib/api/applicationRound';
	import type { StagedApplication } from '$lib/schemas/application';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import NewProgramForm from '$lib/components/program-form/NewProgramForm.svelte';
	import RoundForm from '$lib/components/application-round-form/RoundForm.svelte';
	import Toast from '$lib/components/misc/Toast.svelte';
	import { enhanceDisplayName, orderByName } from '$lib/utils/programUtils';
	import { formatRound, orderByDueDate, orderByRoundName } from '$lib/utils/applicationRoundUtils';

	export let form: any;
	export let contract: Writable<number>;
	export let staged: Writable<StagedApplication[]>;
	export let schoolId: Writable<number | ''>;
	export let programId: Writable<number | ''>;
	export let schools: School[];
	export let programs: ProgramListItem[];
	export let applRounds: ApplicationRoundListItem[];
	export let programTypes: string | string[];
	export let year: number;
	export let term: string;
	export let newProgramForm: SuperValidated<any>;
	export let newApplicationRoundForm: SuperValidated<any>;

	$: $form.contract = $contract;
	$: $form.rounds = $staged.map((item) => item.round.id);

	let roundId: number | '';
	let programModal = false;
	let programWarningModal = false;
	let roundModal = false;
	let roundWarningModal = false;
	let selectedSchool: School;

	let prepError: string = '';

	const onSchoolChange = () => {
		programId.set('');
		onProgramChange();
	};

	const onProgramChange = () => {
		roundId = '';
	};

	const handleCreateProgram = () => {
		if ($schoolId) {
			selectedSchool = schools.filter((s) => s.id === $schoolId)[0];
			programModal = true;
		} else {
			programWarningModal = true;
		}
	};

	const handleCreateRound = () => {
		if ($programId) {
			roundModal = true;
		} else {
			roundWarningModal = true;
		}
	};

	const stageRound = (event: any) => {
		event.preventDefault();

		if (!$schoolId) {
			prepError = 'Please select a school.';
			return;
		}
		if (!$programId) {
			prepError = 'Please select a program.';
			return;
		}
		if (typeof roundId !== 'number') {
			prepError = 'Please select an admission plan.';
			return;
		}

		const program = programs.filter((p) => p.id === $programId)[0];

		if ($staged.map((item) => item.program).includes(program)) {
			prepError = 'You have already added this program.';
			return;
		}

		prepError = '';

		const school = schools.filter((s) => s.id === $schoolId)[0];
		const round = applRounds.filter((r) => r.id === roundId)[0];

		staged.update((items) => [...items, { school, program, round }]);
		schoolId.set('');
		onSchoolChange();
	};

	let showToast = false;
	let missedUC: School[] = [];

	const stageUC = () => {
		const ucNames = [
			'University of California, Berkeley',
			'University of California, Davis',
			'University of California, Irvine',
			'University of California, Los Angeles',
			'University of California, San Diego',
			'University of California, Santa Barbara'
		];

		missedUC = [];

		for (const name of ucNames) {
			const ucSchool = schools.filter((s) => s.name === name)[0];
			const ucProgram = programs.filter(
				(p) => p.type === programTypes && p.schools.map((s) => s.id).includes(ucSchool.id)
			)[0];
			const ucRound = applRounds.filter((r) => r.program_iteration.program === ucProgram.id)[0];

			if (ucRound) {
				staged.update((items) => {
					// if already added, skip
					if (items.map((i) => i.round.id).includes(ucRound.id)) {
						return items;
					} else {
						return [...items, { school: ucSchool, program: ucProgram, round: ucRound }];
					}
				});
			} else {
				missedUC.push(ucSchool);
			}
		}

		if (missedUC.length) {
			showToast = true;
		}
	};
</script>

<form class="form-width">
	<Label for="school" class="form-label">School</Label>
	<Select id="school" bind:value={$schoolId} on:change={onSchoolChange} required>
		{#each schools.sort((a, b) => a.name.localeCompare(b.name)) as schoolOption}
			<option value={schoolOption.id}>{schoolOption.name}</option>
		{/each}
	</Select>

	<Label for="program" class="form-label">Program</Label>
	<Select id="program" bind:value={$programId} on:change={onProgramChange} required>
		{#each programs
			.filter((p) => p.schools.map((s) => s.id).includes($schoolId || 0))
			.sort(orderByName) as programOption}
			<option value={programOption.id}>{enhanceDisplayName(programOption)}</option>
		{/each}
	</Select>
	<Helper class="mt-2 form-helper"
		>If your desired program is not listed, you can create it by <A on:click={handleCreateProgram}
			>clicking here</A
		>.</Helper
	>

	<Label for="round" class="form-label">Admission plan</Label>
	<Select id="round" bind:value={roundId} required>
		{#each applRounds
			.filter((r) => r.program_iteration.program === $programId)
			.sort((a, b) => orderByRoundName(a.name, b.name))
			.sort(orderByDueDate) as roundOption}
			<option value={roundOption.id}>{formatRound(roundOption)}</option>
		{/each}
	</Select>
	<Helper class="mt-2 form-helper"
		>If your desired admission plan is not listed, you can create it by <A
			on:click={handleCreateRound}>clicking here</A
		>.</Helper
	>

	<div class="flex flex-col gap-4 mt-8">
		<Button outline type="submit" class="min-w-24" on:click={stageRound}>
			Add<ChevronDoubleRightOutline class="ms-2" />
		</Button>

		{#if prepError}
			<Helper class="form-helper mb-4 flex items-center font-medium !text-red-500">
				<InfoCircleOutline class="me-1" />{prepError}</Helper
			>
		{/if}

		{#if programTypes === 'UG Freshman' || programTypes === 'UG Transfer'}
			<div class="mt-4 font-medium text-sm text-blue-700">
				You can add the top 6 UC programs with one click:
			</div>
			<Button outline color="blue" type="button" on:click={stageUC}>
				Add UC programs<ChevronDoubleRightOutline class="ms-2" />
			</Button>
		{/if}
	</div>
</form>

<FormModal
	open={programModal}
	superform={newProgramForm}
	fields={NewProgramForm}
	action="?/createProgram"
	title="Create a program"
	school={selectedSchool}
	{schools}
	{programTypes}
	on:close={() => (programModal = false)}
/>

<FormModal
	open={roundModal}
	superform={newApplicationRoundForm}
	fields={RoundForm}
	action="?/createApplicationRound"
	title="Create an admission plan"
	extra={[
		{ name: 'program', type: 'number', value: $programId },
		{ name: 'year', type: 'number', value: year },
		{ name: 'term', type: 'text', value: term }
	]}
	on:close={() => (roundModal = false)}
/>

<Modal
	title="Missing school"
	open={programWarningModal}
	class="w-[24rem]"
	classHeader="!py-3"
	classBody="!pb-6"
	outsideclose
>
	<div class="text-sm flex gap-2 items-center mb-8">
		<InfoCircleOutline />You need to select a school first.
	</div>
	<div class="flex w-full justify-center">
		<Button on:click={() => (programWarningModal = false)}>Okay</Button>
	</div>
</Modal>

<Modal
	title="Missing program"
	open={roundWarningModal}
	class="w-[24rem]"
	classHeader="!py-3"
	classBody="!pb-6"
	outsideclose
>
	<div class="text-sm flex gap-2 items-center mb-8">
		<InfoCircleOutline />You need to select a program first.
	</div>
	<div class="flex w-full justify-center">
		<Button on:click={() => (roundWarningModal = false)}>Okay</Button>
	</div>
</Modal>

{#if showToast}
	<Toast type="error" onClose={() => (showToast = false)}>
		<div>
			{missedUC.length} program{missedUC.length > 1 ? 's' : ''} were not added because {missedUC.length >
			1
				? 'they lack admission plans'
				: 'it lacks an admission plan'}:
		</div>

		<ul class="flex flex-col gap-2 mt-4">
			{#each missedUC as ucSchool}
				<li class="font-medium">&bullet; {ucSchool.name}</li>
			{/each}
		</ul>
	</Toast>
{/if}
