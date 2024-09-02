<script lang="ts">
	import { writable } from 'svelte/store';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Heading } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';

	import type { StudentDetail } from '$lib/api/student';

	import type {
		GreScore,
		GmatScore,
		LsatScore,
		SatScore,
		ActScore,
		ToeflScore,
		IeltsScore,
		DuolingoScore,
		ApScore,
		IbGrade,
		AlevelGrade
	} from '$lib/api/scores';

	import ApScoreItem from '$lib/components/list-items/ApScoreItem.svelte';
	import IbAlevelGradeItem from '$lib/components/list-items/IbAlevelGradeItem.svelte';
	import MultiActionButton from '$lib/components/buttons/MultiActionButton.svelte';

	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import GreScoreForm from '$lib/components/gre-score-form/GreScoreForm.svelte';
	import GmatScoreForm from '$lib/components/gmat-score-form/GmatScoreForm.svelte';
	import LsatScoreForm from '$lib/components/lsat-score-form/LsatScoreForm.svelte';
	import SatScoreForm from '$lib/components/sat-score-form/SatScoreForm.svelte';
	import ActScoreForm from '$lib/components/act-score-form/ActScoreForm.svelte';
	import ToeflScoreForm from '$lib/components/toefl-score-form/ToeflScoreForm.svelte';
	import IeltsScoreForm from '$lib/components/ielts-score-form/IeltsScoreForm.svelte';
	import DuolingoScoreForm from '$lib/components/duolingo-score-form/DuolingoScoreForm.svelte';
	import ApScoreForm from '$lib/components/ap-score-form/ApScoreForm.svelte';
	import IbGradeForm from '$lib/components/ib-grade-form/IbGradeForm.svelte';
	import AlevelGradeForm from '$lib/components/alevel-grade-form/AlevelGradeForm.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';

	import ScoreSectionHeading from '$lib/components/student-page/ScoreSectionHeading.svelte';
	import ToeflSection from '$lib/components/student-page/score-sections/ToeflSection.svelte';
	import SatSection from '$lib/components/student-page/score-sections/SatSection.svelte';
	import ActSection from '$lib/components/student-page/score-sections/ActSection.svelte';
	import IeltsSection from '$lib/components/student-page/score-sections/IeltsSection.svelte';
	import DuolingoSection from '$lib/components/student-page/score-sections/DuolingoSection.svelte';
	import GreSection from '$lib/components/student-page/score-sections/GreSection.svelte';
	import GmatSection from '$lib/components/student-page/score-sections/GmatSection.svelte';
	import LsatSection from '$lib/components/student-page/score-sections/LsatSection.svelte';
	import { orderByPredictedOrFinal, orderBySubject } from '$lib/utils/scoresUtils';

	export let student: StudentDetail;
	export let canEdit: boolean = false;
	export let scoreForms: {
		toefl: SuperValidated<any>;
		ielts: SuperValidated<any>;
		duolingo: SuperValidated<any>;
		sat: SuperValidated<any>;
		act: SuperValidated<any>;
		ap: SuperValidated<any>;
		ib: SuperValidated<any>;
		alevel: SuperValidated<any>;
		gre: SuperValidated<any>;
		gamt: SuperValidated<any>;
		lsat: SuperValidated<any>;
	};
	export let deleteForm: SuperValidated<any>;

	const toeflModal = writable(false);
	const toeflDeleteModal = writable(false);
	const activeToefl = writable<ToeflScore | null>(null);

	const ieltsModal = writable(false);
	const ieltsDeleteModal = writable(false);
	const activeIelts = writable<IeltsScore | null>(null);

	const duolingoModal = writable(false);
	const duolingoDeleteModal = writable(false);
	const activeDuolingo = writable<DuolingoScore | null>(null);

	const satScoreModal = writable(false);
	const satScoreDeleteModal = writable(false);
	const activeSatScore = writable<SatScore | null>(null);

	const actScoreModal = writable(false);
	const actScoreDeleteModal = writable(false);
	const activeActScore = writable<ActScore | null>(null);

	let apScoreModal = false;
	let apScoreDeleteModal = false;
	let activeApScore: ApScore | null = null;

	let ibGradeModal = false;
	let ibGradeDeleteModal = false;
	let activeIbGrade: IbGrade | null = null;

	let alevelGradeModal = false;
	let alevelGradeDeleteModal = false;
	let activeAlevelGrade: AlevelGrade | null = null;

	const greScoreModal = writable(false);
	const greScoreDeleteModal = writable(false);
	const activeGreScore = writable<GreScore | null>(null);

	const gmatScoreModal = writable(false);
	const gmatScoreDeleteModal = writable(false);
	const activeGmatScore = writable<GmatScore | null>(null);

	const lsatScoreModal = writable(false);
	const lsatScoreDeleteModal = writable(false);
	const activeLsatScore = writable<LsatScore | null>(null);

	const toeflModalOpener = (score?: ToeflScore): (() => void) => {
		return () => {
			activeToefl.set(score ?? null);
			toeflModal.set(true);
		};
	};

	const toeflDeleteModalOpener = (score: ToeflScore): (() => void) => {
		return () => {
			activeToefl.set(score);
			toeflDeleteModal.set(true);
		};
	};

	const ieltsModalOpener = (score?: IeltsScore): (() => void) => {
		return () => {
			activeIelts.set(score ?? null);
			ieltsModal.set(true);
		};
	};

	const ieltsDeleteModalOpener = (score: IeltsScore): (() => void) => {
		return () => {
			activeIelts.set(score);
			ieltsDeleteModal.set(true);
		};
	};

	const duolingoModalOpener = (score?: DuolingoScore): (() => void) => {
		return () => {
			activeDuolingo.set(score ?? null);
			duolingoModal.set(true);
		};
	};

	const duolingoDeleteModalOpener = (score: DuolingoScore): (() => void) => {
		return () => {
			activeDuolingo.set(score);
			duolingoDeleteModal.set(true);
		};
	};

	const satScoreModalOpener = (score?: SatScore): (() => void) => {
		return () => {
			activeSatScore.set(score ?? null);
			satScoreModal.set(true);
		};
	};

	const satScoreDeleteModalOpener = (score: SatScore): (() => void) => {
		return () => {
			activeSatScore.set(score);
			satScoreDeleteModal.set(true);
		};
	};

	const actScoreModalOpener = (score?: ActScore): (() => void) => {
		return () => {
			activeActScore.set(score ?? null);
			actScoreModal.set(true);
		};
	};

	const actScoreDeleteModalOpener = (score: ActScore): (() => void) => {
		return () => {
			activeActScore.set(score);
			actScoreDeleteModal.set(true);
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
			activeGreScore.set(score ?? null);
			greScoreModal.set(true);
		};
	};

	const greScoreDeleteModalOpener = (score?: GreScore): (() => void) => {
		return () => {
			activeGreScore.set(score ?? null);
			greScoreDeleteModal.set(true);
		};
	};

	const gmatScoreModalOpener = (score?: GmatScore): (() => void) => {
		return () => {
			activeGmatScore.set(score ?? null);
			gmatScoreModal.set(true);
		};
	};

	const gmatScoreDeleteModalOpener = (score?: GmatScore): (() => void) => {
		return () => {
			activeGmatScore.set(score ?? null);
			gmatScoreDeleteModal.set(true);
		};
	};

	const lsatScoreModalOpener = (score?: LsatScore): (() => void) => {
		return () => {
			activeLsatScore.set(score ?? null);
			lsatScoreModal.set(true);
		};
	};

	const lsatScoreDeleteModalOpener = (score?: LsatScore): (() => void) => {
		return () => {
			activeLsatScore.set(score ?? null);
			lsatScoreDeleteModal.set(true);
		};
	};

	const noScore = (student: StudentDetail) => {
		return (
			!student.toefl.length &&
			!student.ielts.length &&
			!student.duolingo.length &&
			!student.sat.length &&
			!student.act.length &&
			!student.ap.length &&
			!student.ib.length &&
			!student.alevel.length &&
			!student.gre.length &&
			!student.gmat.length &&
			!student.lsat.length
		);
	};

	const newScoreActions = [
		{ text: 'SAT', action: satScoreModalOpener() },
		{ text: 'ACT', action: actScoreModalOpener() },
		{ text: 'GRE', action: greScoreModalOpener(), divider: true },
		{ text: 'GMAT', action: gmatScoreModalOpener() },
		{ text: 'LSAT', action: lsatScoreModalOpener() },
		{ text: 'TOEFL', action: toeflModalOpener(), divider: true },
		{ text: 'IELTS', action: ieltsModalOpener() },
		{ text: 'Duolingo', action: duolingoModalOpener() },
		{ text: 'AP', action: apScoreModalOpener(), divider: true },
		{ text: 'IB', action: ibGradeModalOpener() },
		{ text: 'A-level', action: alevelGradeModalOpener() }
	];
</script>

<article class="mt-16">
	<Heading tag="h2" class="text-2xl font-bold">Test Scores</Heading>

	<div class="flex flex-col gap-6">
		<GreSection
			{student}
			{canEdit}
			onUpdate={greScoreModalOpener}
			onDelete={greScoreDeleteModalOpener}
		/>

		<GmatSection
			{student}
			{canEdit}
			onUpdate={gmatScoreModalOpener}
			onDelete={gmatScoreDeleteModalOpener}
		/>

		<LsatSection
			{student}
			{canEdit}
			onUpdate={lsatScoreModalOpener}
			onDelete={lsatScoreDeleteModalOpener}
		/>

		<SatSection
			{student}
			{canEdit}
			onUpdate={satScoreModalOpener}
			onDelete={satScoreDeleteModalOpener}
		/>

		<ActSection
			{student}
			{canEdit}
			onUpdate={actScoreModalOpener}
			onDelete={actScoreDeleteModalOpener}
		/>

		<ToeflSection
			{student}
			{canEdit}
			onUpdate={toeflModalOpener}
			onDelete={toeflDeleteModalOpener}
		/>

		<IeltsSection
			{student}
			{canEdit}
			onUpdate={ieltsModalOpener}
			onDelete={ieltsDeleteModalOpener}
		/>

		<DuolingoSection
			{student}
			{canEdit}
			onUpdate={duolingoModalOpener}
			onDelete={duolingoDeleteModalOpener}
		/>
	</div>

	{#if student.ap.length}
		<ScoreSectionHeading title="AP" />
		<div class="mt-4 mb-8 grid grid-cols-2 gap-x-4 gap-y-4">
			{#each student.ap.sort(orderBySubject) as score}
				<ApScoreItem
					{score}
					{canEdit}
					updateAction={apScoreModalOpener(score)}
					deleteAction={() => {
						activeApScore = score;
						apScoreDeleteModal = true;
					}}
				/>
			{/each}
		</div>
	{/if}

	{#if student.ib.length}
		<ScoreSectionHeading title="IB" />
		<div class="my-4 mb-8">
			{#each student.ib.sort(orderBySubject).sort(orderByPredictedOrFinal) as grade}
				<IbAlevelGradeItem
					{grade}
					{canEdit}
					updateAction={ibGradeModalOpener(grade)}
					deleteAction={() => {
						activeIbGrade = grade;
						ibGradeDeleteModal = true;
					}}
				/>
			{/each}
		</div>
	{/if}

	{#if student.alevel.length}
		<ScoreSectionHeading title="A-level" />
		<div class="my-4 mb-8 grid grid-cols-2 gap-x-4 gap-y-4">
			{#each student.alevel.sort(orderBySubject).sort(orderByPredictedOrFinal) as grade}
				<IbAlevelGradeItem
					{grade}
					{canEdit}
					updateAction={alevelGradeModalOpener(grade)}
					deleteAction={() => {
						activeAlevelGrade = grade;
						alevelGradeDeleteModal = true;
					}}
				/>
			{/each}
		</div>
	{/if}

	{#if noScore(student) && !canEdit}
		<NoDataSign text="No test scores" divClass="mt-6" />
	{/if}

	{#if canEdit}
		<div class="mt-8">
			<MultiActionButton text="Add a score" actions={newScoreActions} placement="right-end">
				<PlusOutline slot="icon" />
			</MultiActionButton>
		</div>
	{/if}
</article>

<FormModal
	open={$toeflModal}
	superform={scoreForms.toefl}
	fields={ToeflScoreForm}
	action={`/student/${student.id}?/createOrUpdateToeflScore`}
	entity={$activeToefl}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeToefl ? 'Update' : 'Add a'} TOEFL score`}
	on:close={() => toeflModal.set(false)}
/>

<FormModal
	open={$toeflDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteToeflScore`}
	entity={$activeToefl}
	title="Delete TOEFL score"
	on:close={() => toeflDeleteModal.set(false)}
>
	<DeleteMessage slot="preface" name="this TOEFL score" />
</FormModal>

<FormModal
	open={$ieltsModal}
	superform={scoreForms.ielts}
	fields={IeltsScoreForm}
	action={`/student/${student.id}?/createOrUpdateIeltsScore`}
	entity={$activeIelts}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeIelts ? 'Update' : 'Add an'} IELTS score`}
	on:close={() => ieltsModal.set(false)}
/>

<FormModal
	open={$ieltsDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteIeltsScore`}
	entity={$activeIelts}
	title="Delete IELTS score"
	on:close={() => ieltsDeleteModal.set(false)}
>
	<DeleteMessage slot="preface" name="this IELTS score" />
</FormModal>

<FormModal
	open={$duolingoModal}
	superform={scoreForms.duolingo}
	fields={DuolingoScoreForm}
	action={`/student/${student.id}?/createOrUpdateDuolingoScore`}
	entity={$activeDuolingo}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeIelts ? 'Update' : 'Add a'} Duolingo score`}
	on:close={() => duolingoModal.set(false)}
/>

<FormModal
	open={$duolingoDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteDuolingoScore`}
	entity={$activeDuolingo}
	title="Delete Duolingo score"
	on:close={() => duolingoDeleteModal.set(false)}
>
	<DeleteMessage slot="preface" name="this Duolingo score" />
</FormModal>

<FormModal
	open={$satScoreModal}
	superform={scoreForms.sat}
	fields={SatScoreForm}
	action={`/student/${student.id}?/createOrUpdateSatScore`}
	entity={$activeSatScore}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeSatScore ? 'Update' : 'Add an'} SAT score`}
	on:close={() => satScoreModal.set(false)}
/>

<FormModal
	open={$satScoreDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteSatScore`}
	entity={$activeSatScore}
	title="Delete SAT score"
	on:close={() => satScoreDeleteModal.set(false)}
>
	<DeleteMessage slot="preface" name="this SAT score" />
</FormModal>

<FormModal
	open={$actScoreModal}
	superform={scoreForms.act}
	fields={ActScoreForm}
	action={`/student/${student.id}?/createOrUpdateActScore`}
	entity={$activeActScore}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeActScore ? 'Update' : 'Add an'} ACT score`}
	on:close={() => actScoreModal.set(false)}
/>

<FormModal
	open={$actScoreDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteActScore`}
	entity={$activeActScore}
	title="Delete ACT score"
	on:close={() => actScoreDeleteModal.set(false)}
>
	<DeleteMessage slot="preface" name="this ACT score" />
</FormModal>

<FormModal
	open={apScoreModal}
	superform={scoreForms.ap}
	fields={ApScoreForm}
	action={`/student/${student.id}?/createOrUpdateApScore`}
	entity={activeApScore}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeActScore ? 'Update' : 'Add an'} AP score`}
	on:close={() => (apScoreModal = false)}
/>

<FormModal
	open={apScoreDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteApScore`}
	entity={activeApScore}
	title="Delete AP score"
	on:close={() => (apScoreDeleteModal = false)}
>
	<DeleteMessage slot="preface" name={`this AP score (${activeApScore?.subject})`} />
</FormModal>

<FormModal
	open={ibGradeModal}
	superform={scoreForms.ib}
	fields={IbGradeForm}
	action={`/student/${student.id}?/createOrUpdateIbGrade`}
	entity={activeIbGrade}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeIbGrade ? 'Update' : 'Add an'} IB grade`}
	on:close={() => (ibGradeModal = false)}
/>

<FormModal
	open={ibGradeDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteIbGrade`}
	entity={activeIbGrade}
	title="Delete IB grade"
	on:close={() => (ibGradeDeleteModal = false)}
>
	<DeleteMessage slot="preface" name={`this IB grade (${activeIbGrade?.subject})`} />
</FormModal>

<FormModal
	open={alevelGradeModal}
	superform={scoreForms.alevel}
	fields={AlevelGradeForm}
	action={`/student/${student.id}?/createOrUpdateAlevelGrade`}
	entity={activeAlevelGrade}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeAlevelGrade ? 'Update' : 'Add an'} A-level grade`}
	on:close={() => (alevelGradeModal = false)}
/>

<FormModal
	open={alevelGradeDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteAlevelGrade`}
	entity={activeAlevelGrade}
	title="Delete A-level grade"
	on:close={() => (alevelGradeDeleteModal = false)}
>
	<DeleteMessage slot="preface" name={`this A-level grade (${activeAlevelGrade?.subject})`} />
</FormModal>

<FormModal
	open={$greScoreModal}
	superform={scoreForms.gre}
	fields={GreScoreForm}
	action={`/student/${student.id}?/createOrUpdateGreScore`}
	entity={$activeGreScore}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeGreScore ? 'Update' : 'Add a'} GRE score`}
	on:close={() => greScoreModal.set(false)}
/>

<FormModal
	open={$greScoreDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteGreScore`}
	entity={$activeGreScore}
	title="Delete GRE score"
	on:close={() => greScoreDeleteModal.set(false)}
>
	<DeleteMessage slot="preface" name="this GRE score" />
</FormModal>

<FormModal
	open={$gmatScoreModal}
	superform={scoreForms.gamt}
	fields={GmatScoreForm}
	action={`/student/${student.id}?/createOrUpdateGmatScore`}
	entity={$activeGmatScore}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeGmatScore ? 'Update' : 'Add a'} GMAT score`}
	on:close={() => gmatScoreModal.set(false)}
/>

<FormModal
	open={$gmatScoreDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteGmatScore`}
	entity={$activeGmatScore}
	title="Delete GMAT score"
	on:close={() => gmatScoreDeleteModal.set(false)}
>
	<DeleteMessage slot="preface" name="this GMAT score" />
</FormModal>

<FormModal
	open={$lsatScoreModal}
	superform={scoreForms.lsat}
	fields={LsatScoreForm}
	action={`/student/${student.id}?/createOrUpdateLsatScore`}
	entity={$activeLsatScore}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeLsatScore ? 'Update' : 'Add a'} LSAT score`}
	on:close={() => lsatScoreModal.set(false)}
/>

<FormModal
	open={$lsatScoreDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteLsatScore`}
	entity={$activeLsatScore}
	title="Delete LSAT score"
	on:close={() => lsatScoreDeleteModal.set(false)}
>
	<DeleteMessage slot="preface" name="this LSAT score" />
</FormModal>
