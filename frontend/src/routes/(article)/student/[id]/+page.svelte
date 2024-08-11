<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, Heading, Hr, A, Timeline, Badge } from 'flowbite-svelte';
	import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { PlusOutline, PenOutline } from 'flowbite-svelte-icons';

	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import StudentInfobox from '$lib/components/infobox/StudentInfobox.svelte';

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
	import MultiActionButton from '$lib/components/buttons/MultiActionButton.svelte';
	import LinkButton from '$lib/components/buttons/LinkButton.svelte';

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

	$: studentActions = [
		{ text: 'Update bio', action: () => goto(`${data.student.id}/update`) },
		{ text: 'Delete', action: () => alert(`delete ${data.student.id}`), dark: true }
	];
</script>

<Heading tag="h1" class="alt-page-title">{data.student.fullname}</Heading>

<Hr />

<div class="flex gap-24">
	<section class="w-[36rem] min-w-[32rem] flex flex-col">
		<article class="">
			<StudentInfobox student={data.student} />

			{#if canEdit}
				<div class="mt-8">
					<MultiActionButton text="Actions" actions={studentActions}>
						<PenOutline slot="icon" />
					</MultiActionButton>
				</div>
			{/if}
		</article>

		<article class="mt-24">
			<Heading tag="h2" class="text-2xl font-bold">Educational Experience</Heading>

			{#if data.student.enrollments.length}
				<Timeline class="mt-8 flex flex-col gap-4">
					{#each data.student.enrollments as enrollment}
						<EnrollmentItem {enrollment}>
							{#if canEdit}
								<MultiActionButton
									actions={[
										{ text: 'Update', action: enrollmentModalOpener(enrollment) },
										{ text: 'Delete', action: () => alert('delete enrollment'), dark: true }
									]}
								>
									<PenOutline slot="icon" />
								</MultiActionButton>
							{/if}
						</EnrollmentItem>
					{/each}
				</Timeline>
			{/if}

			{#if canEdit}
				<div class="mt-8">
					<LinkButton text="Add educational experience" action={enrollmentModalOpener()}>
						<PlusOutline slot="icon" />
					</LinkButton>
				</div>
			{/if}
		</article>

		<article class="mt-24">
			<Heading tag="h2" class="text-2xl font-bold">Test Scores</Heading>

			<div class="flex flex-col gap-6 divide-y-2 divide-dotted mb-8">
				{#each data.student.toefl as score}
					<ToeflScoreItem {score} onClick={toeflModalOpener(score)} />
				{/each}
				{#each data.student.ielts as score}
					<IeltsScoreItem {score} onClick={ieltsModalOpener(score)} />
				{/each}
				{#each data.student.duolingo as score}
					<DuolingoScoreItem {score} onClick={duolingoModalOpener(score)} />
				{/each}
				{#each data.student.sat as score}
					<SatScoreItem {score} onClick={satScoreModalOpener(score)} />
				{/each}
				{#each data.student.act as score}
					<ActScoreItem {score} onClick={actScoreModalOpener(score)} />
				{/each}
				{#each data.student.gre as gre}
					<GreScoreItem score={gre} onClick={greScoreModalOpener(gre)} />
				{/each}
			</div>

			{#if data.student.ap.length}
				<Heading
					tag="h3"
					class="text-lg font-medium px-4 py-0.5 bg-gradient-to-r from-primary-400 to-white"
				>
					AP
				</Heading>
				<div class="mt-4 mb-8 grid grid-cols-2 gap-x-6 gap-y-4">
					{#each data.student.ap as score}
						<ApScoreItem {score} onClick={apScoreModalOpener(score)} />
					{/each}
				</div>
			{/if}

			{#if data.student.ib.length}
				<Heading
					tag="h3"
					class="text-lg font-medium px-4 py-0.5 bg-gradient-to-r from-primary-400 to-white"
				>
					IB
				</Heading>
				<div class="my-4 mb-8">
					{#each data.student.ib as ib}
						<IbAlevelGradeItem grade={ib} onClick={ibGradeModalOpener(ib)} />
					{/each}
				</div>
			{/if}

			{#if data.student.alevel.length}
				<Heading
					tag="h3"
					class="text-lg font-medium px-4 py-0.5 bg-gradient-to-r from-primary-400 to-white"
				>
					A-level
				</Heading>
				<div class="my-4 mb-8 grid grid-cols-2 gap-x-6 gap-y-4">
					{#each data.student.alevel as alevel}
						<IbAlevelGradeItem grade={alevel} onClick={alevelGradeModalOpener(alevel)} />
					{/each}
				</div>
			{/if}

			<MultiActionButton
				text="Add a score"
				actions={[
					{ text: 'TOEFL', action: toeflModalOpener() },
					{ text: 'IELTS', action: ieltsModalOpener() },
					{ text: 'Duolingo', action: duolingoModalOpener() },
					{ text: 'SAT', action: satScoreModalOpener(), divider: true },
					{ text: 'ACT', action: actScoreModalOpener() },
					{ text: 'AP', action: apScoreModalOpener() },
					{ text: 'IB', action: ibGradeModalOpener() },
					{ text: 'A-level', action: alevelGradeModalOpener() },
					{ text: 'GRE', action: greScoreModalOpener(), divider: true }
				]}
			>
				<PlusOutline slot="icon" />
			</MultiActionButton>
		</article>
	</section>

	<section class="min-w-[32rem] flex flex-col">
		<article class="bg-slate-50 rounded-xl w-full h-fit p-8 text-gray-400">
			{#if data.student.contracts_sorted.length}
				<div class="flex gap-8 mb-8">
					{#each data.student.contracts_sorted as contract}
						<ContractItem {contract}>
							{#if canEdit || !contract.services.length}
								<MultiActionButton
									actions={[
										{ text: 'Update', action: contractModalOpener(contract) },
										{ text: 'Delete', action: () => alert('delete contract'), dark: true }
									]}
								>
									<PenOutline slot="icon" />
								</MultiActionButton>
							{/if}
						</ContractItem>
					{/each}
				</div>
				<LinkButton text="Add a contract" action={contractModalOpener()}>
					<PlusOutline slot="icon" />
				</LinkButton>
			{:else}
				<Button on:click={contractModalOpener()}>Add a contract</Button>
			{/if}
		</article>

		<article class="mt-24">
			<Heading tag="h2" class="text-2xl font-bold flex items-center gap-2">
				Applications<Badge>{data.applications.length}</Badge>
			</Heading>

			{#if data.applications.length}
				<Table class="mt-8">
					<TableBody>
						{#each data.applications as appl}
							<TableBodyRow>
								<TableBodyCell class="pl-0 w-fit max-w-48 truncate">
									<A href={`/application/${appl.id}`}>
										{appl.schools.map((s) => s.name).join(' + ')}
									</A>
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

<Hr hrClass="mt-16" />
