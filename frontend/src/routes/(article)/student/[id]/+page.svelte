<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, Heading, Hr, Dropdown, A, Timeline } from 'flowbite-svelte';
	import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import {
		ChevronRightOutline,
		PenOutline as ActionIcon,
		ArrowUpRightFromSquareOutline
	} from 'flowbite-svelte-icons';

	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import StudentInfobox from '$lib/components/infobox/StudentInfobox.svelte';
	import DropdownActionItem from '$lib/components/list-items/DropdownActionItem.svelte';

	import type { Contract } from '$lib/api/contract';
	import ContractForm from '$lib/components/contract-form/ContractForm.svelte';
	import ContractItem from '$lib/components/list-items/ContractItem.svelte';

	import type { Enrollment } from '$lib/api/enrollment';
	import EnrollmentForm from '$lib/components/enrollment-form/EnrollmentForm.svelte';
	import EnrollmentItem from '$lib/components/list-items/EnrollmentItem.svelte';

	import type {
		ToeflScore,
		IeltsScore,
		DuolingoScore,
		SatScore,
		ActScore,
		ApScore,
		IbGrade,
		AlevelGrade,
		GreScore
	} from '$lib/api/scores';

	import ToeflScoreForm from '$lib/components/toefl-score-form/ToeflScoreForm.svelte';
	import IeltsScoreForm from '$lib/components/ielts-score-form/IeltsScoreForm.svelte';
	import DuolingoScoreForm from '$lib/components/duolingo-score-form/DuolingoScoreForm.svelte';
	import SatScoreForm from '$lib/components/sat-score-form/SatScoreForm.svelte';
	import ActScoreForm from '$lib/components/act-score-form/ActScoreForm.svelte';
	import ApScoreForm from '$lib/components/ap-score-form/ApScoreForm.svelte';
	import IbGradeForm from '$lib/components/ib-grade-form/IbGradeForm.svelte';
	import AlevelGradeForm from '$lib/components/alevel-grade-form/AlevelGradeForm.svelte';
	import GreScoreForm from '$lib/components/gre-score-form/GreScoreForm.svelte';

	import ToeflScoreItem from '$lib/components/list-items/ToeflScoreItem.svelte';
	import IeltsScoreItem from '$lib/components/list-items/IeltsScoreItem.svelte';
	import DuolingoScoreItem from '$lib/components/list-items/DuolingoScoreItem.svelte';
	import SatScoreItem from '$lib/components/list-items/SatScoreItem.svelte';
	import ActScoreItem from '$lib/components/list-items/ActScoreItem.svelte';
	import ApScoreItem from '$lib/components/list-items/ApScoreItem.svelte';
	import IbAlevelGradeItem from '$lib/components/list-items/IbAlevelGradeItem.svelte';
	import GreScoreItem from '$lib/components/list-items/GreScoreItem.svelte';

	export let data;

	$: canEdit = true;

	let contractModal = false;
	let activeContract: Contract | null = null;

	let enrollmentModal = false;
	let activeEnrollment: Enrollment | null = null;

	let toeflModal = false;
	let activeToefl: ToeflScore | null = null;

	let ieltsModal = false;
	let activeIelts: IeltsScore | null = null;

	let duolingoModal = false;
	let activeDuolingo: DuolingoScore | null = null;

	let satScoreModal = false;
	let activeSatScore: SatScore | null = null;

	let actScoreModal = false;
	let activeActScore: ActScore | null = null;

	let apScoreModal = false;
	let activeApScore: ApScore | null = null;

	let ibGradeModal = false;
	let activeIbGrade: IbGrade | null = null;

	let alevelGradeModal = false;
	let activeAlevelGrade: AlevelGrade | null = null;

	let greScoreModal = false;
	let activeGreScore: GreScore | null = null;

	const contractModalOpener = (contract?: Contract): (() => void) => {
		return () => {
			activeContract = contract ?? null;
			contractModal = true;
		};
	};

	const enrollmentModalOpener = (enrollment?: Enrollment): (() => void) => {
		return () => {
			activeEnrollment = enrollment ?? null;
			enrollmentModal = true;
		};
	};

	const toeflModalOpener = (score?: ToeflScore): (() => void) => {
		return () => {
			activeToefl = score ?? null;
			toeflModal = true;
		};
	};

	const ieltsModalOpener = (score?: IeltsScore): (() => void) => {
		return () => {
			activeIelts = score ?? null;
			ieltsModal = true;
		};
	};

	const duolingoModalOpener = (score?: DuolingoScore): (() => void) => {
		return () => {
			activeDuolingo = score ?? null;
			duolingoModal = true;
		};
	};

	const satScoreModalOpener = (score?: SatScore): (() => void) => {
		return () => {
			activeSatScore = score ?? null;
			satScoreModal = true;
		};
	};

	const actScoreModalOpener = (score?: ActScore): (() => void) => {
		return () => {
			activeActScore = score ?? null;
			actScoreModal = true;
		};
	};

	const apScoreModalOpener = (score?: ApScore): (() => void) => {
		return () => {
			activeApScore = score ?? null;
			apScoreModal = true;
		};
	};

	const ibGradeModalOpener = (grade?: IbGrade): (() => void) => {
		return () => {
			activeIbGrade = grade ?? null;
			ibGradeModal = true;
		};
	};

	const alevelGradeModalOpener = (grade?: AlevelGrade): (() => void) => {
		return () => {
			activeAlevelGrade = grade ?? null;
			alevelGradeModal = true;
		};
	};

	const greScoreModalOpener = (score?: GreScore): (() => void) => {
		return () => {
			activeGreScore = score ?? null;
			greScoreModal = true;
		};
	};
</script>

<Heading tag="h1" class="alt-page-title">{data.student.fullname}</Heading>

<Hr />

<div class="flex gap-24">
	<section class="w-[36rem] min-w-[32rem] flex flex-col">
		<article class="">
			<StudentInfobox student={data.student} />

			{#if canEdit}
				<div class="flex gap-x-8 mt-8">
					<Button outline>Actions<ChevronRightOutline class="w-6 h-6 ms-1" /></Button>
					<Dropdown class="w-40 z-20" placement="right-start">
						<DropdownActionItem
							text="Update bio"
							onClick={() => goto(`${data.student.id}/update`)}
						/>
						<DropdownActionItem text="Delete" onClick={() => alert('delete student file')} dark />
					</Dropdown>
				</div>
			{/if}
		</article>

		<article class="mt-16">
			<Heading tag="h2" class="text-xl font-bold">Educational experience</Heading>

			{#if data.student.enrollments.length}
				<Timeline class="mt-8 flex flex-col gap-4">
					{#each data.student.enrollments as enrollment}
						<EnrollmentItem {enrollment}>
							{#if canEdit}
								<div class="text-sm mt-4 flex gap-4">
									<A on:click={enrollmentModalOpener(enrollment)}><ActionIcon /></A>
									<A href={`/grades/${enrollment.id}`}><ArrowUpRightFromSquareOutline /></A>
								</div>
							{/if}
						</EnrollmentItem>
					{/each}
				</Timeline>
			{/if}

			{#if canEdit}
				<A class="mt-8 text-sm font-medium" on:click={enrollmentModalOpener()}>
					Add educational experience
				</A>
			{/if}
		</article>

		<article class="mt-16">
			<Heading tag="h2" class="text-xl font-bold">Test scores</Heading>

			<div class="my-4 divide divide-y-[1px] divide-solid">
				{#each data.student.toefl as score}
					<ToeflScoreItem {score} onClick={toeflModalOpener(score)} />
				{/each}
			</div>
			<A class="text-sm font-medium" on:click={toeflModalOpener()}>Add a TOEFL score</A>

			<div class="my-4 divide divide-y-[1px] divide-solid">
				{#each data.student.ielts as score}
					<IeltsScoreItem {score} onClick={ieltsModalOpener(score)} />
				{/each}
			</div>
			<A class="text-sm font-medium" on:click={ieltsModalOpener()}>Add an IELTS score</A>

			<div class="my-4 divide divide-y-[1px] divide-solid">
				{#each data.student.duolingo as score}
					<DuolingoScoreItem {score} onClick={duolingoModalOpener(score)} />
				{/each}
			</div>
			<A class="text-sm font-medium" on:click={duolingoModalOpener()}>Add a Duolingo score</A>

			<div class="my-4 divide divide-y-[1px] divide-solid">
				{#each data.student.sat as score}
					<SatScoreItem {score} onClick={satScoreModalOpener(score)} />
				{/each}
			</div>
			<A class="text-sm font-medium" on:click={satScoreModalOpener()}>Add a SAT score</A>

			<div class="my-4 divide divide-y-[1px] divide-solid">
				{#each data.student.act as score}
					<ActScoreItem {score} onClick={actScoreModalOpener(score)} />
				{/each}
			</div>
			<A class="text-sm font-medium" on:click={actScoreModalOpener()}>Add an ACT score</A>

			<div class="my-4 grid grid-cols-2 gap-4">
				{#each data.student.ap as score}
					<ApScoreItem {score} onClick={apScoreModalOpener(score)} />
				{/each}
			</div>
			<A class="text-sm font-medium" on:click={apScoreModalOpener()}>Add an AP score</A>

			<div class="my-4">
				{#each data.student.ib as ib}
					<IbAlevelGradeItem grade={ib} onClick={ibGradeModalOpener(ib)} />
				{/each}
			</div>
			<A class="text-sm font-medium" on:click={ibGradeModalOpener()}>Add an IB grade</A>

			<div class="my-4 grid grid-cols-2 gap-4">
				{#each data.student.alevel as alevel}
					<IbAlevelGradeItem grade={alevel} onClick={alevelGradeModalOpener(alevel)} />
				{/each}
			</div>
			<A class="text-sm font-medium" on:click={alevelGradeModalOpener()}>Add an A-level grade</A>

			<div class="my-4 divide divide-y-[1px] divide-solid">
				{#each data.student.gre as gre}
					<GreScoreItem score={gre} onClick={greScoreModalOpener(gre)} />
				{/each}
			</div>
			<A class="text-sm font-medium" on:click={greScoreModalOpener()}>Add a GRE score</A>
		</article>
	</section>

	<section class="flex flex-col">
		<article class="bg-slate-50 rounded-xl w-full min-w-[32rem] h-fit p-8 text-gray-400">
			{#if data.student.contracts_sorted.length}
				<div class="flex gap-8 mb-8">
					{#each data.student.contracts_sorted as contract}
						<ContractItem {contract}>
							{#if canEdit || !contract.services.length}
								<div class="mt-8 flex gap-4">
									<A class="text-sm" on:click={contractModalOpener(contract)}><ActionIcon /></A>
									<A class="text-sm" on:click={() => alert('delete contract')}>Delete</A>
								</div>
							{/if}
						</ContractItem>
					{/each}
				</div>
				<A class="text-sm font-medium ml-1" on:click={contractModalOpener()}>Add a contract</A>
			{:else}
				<Button on:click={contractModalOpener()}>Add a contract</Button>
			{/if}
		</article>

		<article class="mt-16">
			<Heading tag="h2" class="text-xl font-bold">
				Applications ({data.applications.length})
			</Heading>

			{#if data.applications.length}
				<Table class="mt-8">
					<TableBody>
						{#each data.applications as appl}
							<TableBodyRow>
								<TableBodyCell class="font-normal pl-0">
									<A href={`/application/${appl.id}`}>Link</A>
								</TableBodyCell>
								<TableBodyCell class="w-fit max-w-48 truncate">
									{appl.schools.map((s) => s.name).join(' + ')}
								</TableBodyCell>
								<TableBodyCell class="font-normal max-w-44 truncate">
									{appl.program.display_name}
								</TableBodyCell>
								<TableBodyCell class="font-normal">{appl.program_iteration.year}</TableBodyCell>
								<TableBodyCell class="font-normal">{appl.round.name}</TableBodyCell>
								<TableBodyCell class="">{appl.latest_log?.status ?? ''}</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			{/if}

			<Button outline href={`/student/${data.student.id}/new-application`} class="mt-8">
				Create an application
			</Button>
		</article>
	</section>
</div>

<FormModal
	open={contractModal}
	superform={data.contractForm}
	fields={ContractForm}
	action="?/createOrUpdateContract"
	entity={activeContract}
	extra={[{ name: 'student', type: 'number', value: data.student.id }]}
	title={`${activeContract ? 'Update' : 'Create a'} contract`}
	on:close={() => (contractModal = false)}
/>

<FormModal
	open={enrollmentModal}
	superform={data.enrollmentForm}
	fields={EnrollmentForm}
	action="?/createOrUpdateEnrollment"
	entity={activeEnrollment}
	extra={[{ name: 'student', type: 'number', value: data.student.id }]}
	title={`${activeEnrollment ? 'Update' : 'Add'} education experience`}
	on:close={() => (enrollmentModal = false)}
/>

<FormModal
	open={toeflModal}
	superform={data.toeflForm}
	fields={ToeflScoreForm}
	action="?/createOrUpdateToeflScore"
	entity={activeToefl}
	extra={[{ name: 'student', type: 'number', value: data.student.id }]}
	title={`${activeToefl ? 'Update' : 'Add a'} TOEFL score`}
	on:close={() => (toeflModal = false)}
/>

<FormModal
	open={ieltsModal}
	superform={data.ieltsForm}
	fields={IeltsScoreForm}
	action="?/createOrUpdateIeltsScore"
	entity={activeIelts}
	extra={[{ name: 'student', type: 'number', value: data.student.id }]}
	title={`${activeIelts ? 'Update' : 'Add an'} IELTS score`}
	on:close={() => (ieltsModal = false)}
/>

<FormModal
	open={duolingoModal}
	superform={data.duolingoForm}
	fields={DuolingoScoreForm}
	action="?/createOrUpdateDuolingoScore"
	entity={activeDuolingo}
	extra={[{ name: 'student', type: 'number', value: data.student.id }]}
	title={`${activeIelts ? 'Update' : 'Add a'} Duolingo score`}
	on:close={() => (duolingoModal = false)}
/>

<FormModal
	open={satScoreModal}
	superform={data.satScoreForm}
	fields={SatScoreForm}
	action="?/createOrUpdateSatScore"
	entity={activeSatScore}
	extra={[{ name: 'student', type: 'number', value: data.student.id }]}
	title={`${activeSatScore ? 'Update' : 'Add an'} SAT score`}
	on:close={() => (satScoreModal = false)}
/>

<FormModal
	open={actScoreModal}
	superform={data.actScoreForm}
	fields={ActScoreForm}
	action="?/createOrUpdateActScore"
	entity={activeActScore}
	extra={[{ name: 'student', type: 'number', value: data.student.id }]}
	title={`${activeActScore ? 'Update' : 'Add an'} ACT score`}
	on:close={() => (actScoreModal = false)}
/>

<FormModal
	open={apScoreModal}
	superform={data.apScoreForm}
	fields={ApScoreForm}
	action="?/createOrUpdateApScore"
	entity={activeApScore}
	extra={[{ name: 'student', type: 'number', value: data.student.id }]}
	title={`${activeActScore ? 'Update' : 'Add an'} AP score`}
	on:close={() => (apScoreModal = false)}
/>

<FormModal
	open={ibGradeModal}
	superform={data.ibGradeForm}
	fields={IbGradeForm}
	action="?/createOrUpdateIbGrade"
	entity={activeIbGrade}
	extra={[{ name: 'student', type: 'number', value: data.student.id }]}
	title={`${activeIbGrade ? 'Update' : 'Add an'} IB grade`}
	on:close={() => (ibGradeModal = false)}
/>

<FormModal
	open={alevelGradeModal}
	superform={data.alevelGradeForm}
	fields={AlevelGradeForm}
	action="?/createOrUpdateAlevelGrade"
	entity={activeAlevelGrade}
	extra={[{ name: 'student', type: 'number', value: data.student.id }]}
	title={`${activeAlevelGrade ? 'Update' : 'Add an'} A-level grade`}
	on:close={() => (alevelGradeModal = false)}
/>

<FormModal
	open={greScoreModal}
	superform={data.greScoreForm}
	fields={GreScoreForm}
	action="?/createOrUpdateGreScore"
	entity={activeGreScore}
	extra={[{ name: 'student', type: 'number', value: data.student.id }]}
	title={`${activeGreScore ? 'Update' : 'Add a'} GRE score`}
	on:close={() => (greScoreModal = false)}
/>

<Hr />
