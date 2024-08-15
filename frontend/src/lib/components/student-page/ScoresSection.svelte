<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Heading } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';

	import type { StudentDetail } from '$lib/api/student';
	import type {
		GreScore,
		SatScore,
		ActScore,
		ToeflScore,
		IeltsScore,
		DuolingoScore,
		ApScore,
		IbGrade,
		AlevelGrade
	} from '$lib/api/scores';

	import GreScoreItem from '$lib/components/list-items/GreScoreItem.svelte';
	import SatScoreItem from '$lib/components/list-items/SatScoreItem.svelte';
	import ActScoreItem from '$lib/components/list-items/ActScoreItem.svelte';
	import ToeflScoreItem from '$lib/components/list-items/ToeflScoreItem.svelte';
	import IeltsScoreItem from '$lib/components/list-items/IeltsScoreItem.svelte';
	import DuolingoScoreItem from '$lib/components/list-items/DuolingoScoreItem.svelte';
	import ApScoreItem from '$lib/components/list-items/ApScoreItem.svelte';
	import IbAlevelGradeItem from '$lib/components/list-items/IbAlevelGradeItem.svelte';
	import MultiActionButton from '$lib/components/buttons/MultiActionButton.svelte';

	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import GreScoreForm from '$lib/components/gre-score-form/GreScoreForm.svelte';
	import SatScoreForm from '$lib/components/sat-score-form/SatScoreForm.svelte';
	import ActScoreForm from '$lib/components/act-score-form/ActScoreForm.svelte';
	import ToeflScoreForm from '$lib/components/toefl-score-form/ToeflScoreForm.svelte';
	import IeltsScoreForm from '$lib/components/ielts-score-form/IeltsScoreForm.svelte';
	import DuolingoScoreForm from '$lib/components/duolingo-score-form/DuolingoScoreForm.svelte';
	import ApScoreForm from '$lib/components/ap-score-form/ApScoreForm.svelte';
	import IbGradeForm from '$lib/components/ib-grade-form/IbGradeForm.svelte';
	import AlevelGradeForm from '$lib/components/alevel-grade-form/AlevelGradeForm.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import DeleteForm from '../delete-form/DeleteForm.svelte';
	import DeleteMessage from '../delete-form/DeleteMessage.svelte';

	export let student: StudentDetail;
	export let canEdit: boolean = false;
	export let greScoreForm: SuperValidated<any>;
	export let satScoreForm: SuperValidated<any>;
	export let actScoreForm: SuperValidated<any>;
	export let toeflForm: SuperValidated<any>;
	export let ieltsForm: SuperValidated<any>;
	export let duolingoForm: SuperValidated<any>;
	export let apScoreForm: SuperValidated<any>;
	export let ibGradeForm: SuperValidated<any>;
	export let alevelGradeForm: SuperValidated<any>;
	export let deleteForm: SuperValidated<any>;

	let toeflModal = false;
	let toeflDeleteModal = false;
	let activeToefl: ToeflScore | null = null;

	let ieltsModal = false;
	let ieltsDeleteModal = false;
	let activeIelts: IeltsScore | null = null;

	let duolingoModal = false;
	let duolingoDeleteModal = false;
	let activeDuolingo: DuolingoScore | null = null;

	let satScoreModal = false;
	let satScoreDeleteModal = false;
	let activeSatScore: SatScore | null = null;

	let actScoreModal = false;
	let actScoreDeleteModal = false;
	let activeActScore: ActScore | null = null;

	let apScoreModal = false;
	let apScoreDeleteModal = false;
	let activeApScore: ApScore | null = null;

	let ibGradeModal = false;
	let ibGradeDeleteModal = false;
	let activeIbGrade: IbGrade | null = null;

	let alevelGradeModal = false;
	let alevelGradeDeleteModal = false;
	let activeAlevelGrade: AlevelGrade | null = null;

	let greScoreModal = false;
	let greScoreDeleteModal = false;
	let activeGreScore: GreScore | null = null;

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
			!student.gre.length
		);
	};

	const newScoreActions = [
		{ text: 'SAT', action: satScoreModalOpener() },
		{ text: 'ACT', action: actScoreModalOpener() },
		{ text: 'GRE', action: greScoreModalOpener(), divider: true },
		{ text: 'TOEFL', action: toeflModalOpener(), divider: true },
		{ text: 'IELTS', action: ieltsModalOpener() },
		{ text: 'Duolingo', action: duolingoModalOpener() },
		{ text: 'AP', action: apScoreModalOpener(), divider: true },
		{ text: 'IB', action: ibGradeModalOpener() },
		{ text: 'A-level', action: alevelGradeModalOpener() }
	];
</script>

<article class="mt-24">
	<Heading tag="h2" class="text-2xl font-bold">Test Scores</Heading>

	<div class="flex flex-col gap-6 divide-y-2 divide-dotted">
		{#each student.gre as score}
			<GreScoreItem
				{score}
				{canEdit}
				updateAction={greScoreModalOpener(score)}
				deleteAction={() => {
					activeGreScore = score;
					greScoreDeleteModal = true;
				}}
			/>
		{/each}

		{#each student.sat as score}
			<SatScoreItem
				{score}
				{canEdit}
				updateAction={satScoreModalOpener(score)}
				deleteAction={() => {
					activeSatScore = score;
					satScoreDeleteModal = true;
				}}
			/>
		{/each}

		{#each student.act as score}
			<ActScoreItem
				{score}
				{canEdit}
				updateAction={actScoreModalOpener(score)}
				deleteAction={() => {
					activeActScore = score;
					actScoreDeleteModal = true;
				}}
			/>
		{/each}

		{#each student.toefl as score}
			<ToeflScoreItem
				{score}
				{canEdit}
				updateAction={toeflModalOpener(score)}
				deleteAction={() => {
					activeToefl = score;
					toeflDeleteModal = true;
				}}
			/>
		{/each}

		{#each student.ielts as score}
			<IeltsScoreItem
				{score}
				{canEdit}
				updateAction={ieltsModalOpener(score)}
				deleteAction={() => {
					activeIelts = score;
					ieltsDeleteModal = true;
				}}
			/>
		{/each}

		{#each student.duolingo as score}
			<DuolingoScoreItem
				{score}
				{canEdit}
				updateAction={duolingoModalOpener(score)}
				deleteAction={() => {
					activeDuolingo = score;
					duolingoDeleteModal = true;
				}}
			/>
		{/each}
	</div>

	{#if student.ap.length}
		<Heading tag="h3" class="mt-8 text-lg font-medium px-2 pb-0.5 border-b-2 border-primary-700">
			AP
		</Heading>
		<div class="mt-4 mb-8 grid grid-cols-2 gap-x-4 gap-y-4">
			{#each student.ap as score}
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
		<Heading tag="h3" class="mt-8 text-lg font-medium px-2 pb-0.5 border-b-2 border-primary-700">
			IB
		</Heading>
		<div class="my-4 mb-8">
			{#each student.ib as grade}
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
		<Heading tag="h3" class="mt-8 text-lg font-medium px-2 pb-0.5 border-b-2 border-primary-700">
			A-level
		</Heading>
		<div class="my-4 mb-8 grid grid-cols-2 gap-x-4 gap-y-4">
			{#each student.alevel as grade}
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
	open={toeflModal}
	superform={toeflForm}
	fields={ToeflScoreForm}
	action={`/student/${student.id}?/createOrUpdateToeflScore`}
	entity={activeToefl}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeToefl ? 'Update' : 'Add a'} TOEFL score`}
	on:close={() => (toeflModal = false)}
/>

<FormModal
	open={toeflDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteToeflScore`}
	entity={activeToefl}
	title="Delete TOEFL score"
	on:close={() => (toeflDeleteModal = false)}
>
	<DeleteMessage slot="preface" name="this TOEFL score" />
</FormModal>

<FormModal
	open={ieltsModal}
	superform={ieltsForm}
	fields={IeltsScoreForm}
	action={`/student/${student.id}?/createOrUpdateIeltsScore`}
	entity={activeIelts}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeIelts ? 'Update' : 'Add an'} IELTS score`}
	on:close={() => (ieltsModal = false)}
/>

<FormModal
	open={ieltsDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteIeltsScore`}
	entity={activeIelts}
	title="Delete IELTS score"
	on:close={() => (ieltsDeleteModal = false)}
>
	<DeleteMessage slot="preface" name="this IELTS score" />
</FormModal>

<FormModal
	open={duolingoModal}
	superform={duolingoForm}
	fields={DuolingoScoreForm}
	action={`/student/${student.id}?/createOrUpdateDuolingoScore`}
	entity={activeDuolingo}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeIelts ? 'Update' : 'Add a'} Duolingo score`}
	on:close={() => (duolingoModal = false)}
/>

<FormModal
	open={duolingoDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteDuolingoScore`}
	entity={activeDuolingo}
	title="Delete Duolingo score"
	on:close={() => (duolingoDeleteModal = false)}
>
	<DeleteMessage slot="preface" name="this Duolingo score" />
</FormModal>

<FormModal
	open={satScoreModal}
	superform={satScoreForm}
	fields={SatScoreForm}
	action={`/student/${student.id}?/createOrUpdateSatScore`}
	entity={activeSatScore}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeSatScore ? 'Update' : 'Add an'} SAT score`}
	on:close={() => (satScoreModal = false)}
/>

<FormModal
	open={satScoreDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteSatScore`}
	entity={activeSatScore}
	title="Delete SAT score"
	on:close={() => (satScoreDeleteModal = false)}
>
	<DeleteMessage slot="preface" name="this SAT score" />
</FormModal>

<FormModal
	open={actScoreModal}
	superform={actScoreForm}
	fields={ActScoreForm}
	action={`/student/${student.id}?/createOrUpdateActScore`}
	entity={activeActScore}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeActScore ? 'Update' : 'Add an'} ACT score`}
	on:close={() => (actScoreModal = false)}
/>

<FormModal
	open={actScoreDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteActScore`}
	entity={activeActScore}
	title="Delete ACT score"
	on:close={() => (actScoreDeleteModal = false)}
>
	<DeleteMessage slot="preface" name="this ACT score" />
</FormModal>

<FormModal
	open={apScoreModal}
	superform={apScoreForm}
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
	superform={ibGradeForm}
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
	superform={alevelGradeForm}
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
	open={greScoreModal}
	superform={greScoreForm}
	fields={GreScoreForm}
	action={`/student/${student.id}?/createOrUpdateGreScore`}
	entity={activeGreScore}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeGreScore ? 'Update' : 'Add a'} GRE score`}
	on:close={() => (greScoreModal = false)}
/>

<FormModal
	open={greScoreDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteGreScore`}
	entity={activeGreScore}
	title="Delete GRE score"
	on:close={() => (greScoreDeleteModal = false)}
>
	<DeleteMessage slot="preface" name="this GRE score" />
</FormModal>
