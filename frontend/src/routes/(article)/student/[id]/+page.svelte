<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, Heading, Hr, Dropdown, A, Timeline } from 'flowbite-svelte';
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

	import type { Enrollment } from '$lib/api/student.js';
	import EnrollmentForm from '$lib/components/enrollment-form/EnrollmentForm.svelte';
	import EnrollmentItem from '$lib/components/list-items/EnrollmentItem.svelte';

	import type { ActScore, GreScore, IeltsScore, SatScore, ToeflScore } from '$lib/api/scores';
	import ToeflScoreForm from '$lib/components/toefl-score-form/ToeflScoreForm.svelte';
	import IeltsScoreForm from '$lib/components/ielts-score-form/IeltsScoreForm.svelte';
	import SatScoreForm from '$lib/components/sat-score-form/SatScoreForm.svelte';
	import ActScoreForm from '$lib/components/act-score-form/ActScoreForm.svelte';
	import GreScoreForm from '$lib/components/gre-score-form/GreScoreForm.svelte';

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

	let satScoreModal = false;
	let activeSatScore: SatScore | null = null;

	let actScoreModal = false;
	let activeActScore: ActScore | null = null;

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
									<A href=""><ArrowUpRightFromSquareOutline /></A>
								</div>
							{/if}
						</EnrollmentItem>
					{/each}
				</Timeline>
			{/if}

			{#if canEdit}
				<A class="mt-8 text-sm font-medium" on:click={enrollmentModalOpener()}>Add experience</A>
			{/if}
		</article>

		<article class="mt-16">
			<Heading tag="h2" class="text-xl font-bold">Test scores</Heading>

			<div>
				{#each data.student.toefl as toefl}
					<div class="flex my-4 gap-4">
						<A on:click={toeflModalOpener(toefl)}>Update TOEFL</A>
						<pre class="text-sm text-gray-500 bg-slate-100">{JSON.stringify(toefl, null, 2)}</pre>
					</div>
				{/each}
				<A class="text-sm font-medium" on:click={toeflModalOpener()}>Add a TOEFL score</A>
			</div>

			<div>
				{#each data.student.ielts as ielts}
					<div class="flex my-4 gap-4">
						<A on:click={ieltsModalOpener(ielts)}>Update IELTS</A>
						<pre class="text-sm text-gray-500 bg-slate-100">{JSON.stringify(ielts, null, 2)}</pre>
					</div>
				{/each}
				<A class="text-sm font-medium" on:click={ieltsModalOpener()}>Add an IELTS score</A>
			</div>

			<div>
				{#each data.student.sat as sat}
					<div class="flex my-4 gap-4">
						<A on:click={satScoreModalOpener(sat)}>Update SAT</A>
						<pre class="text-sm text-gray-500 bg-slate-100">{JSON.stringify(sat, null, 2)}</pre>
					</div>
				{/each}
				<A class="text-sm font-medium" on:click={satScoreModalOpener()}>Add a SAT score</A>
			</div>

			<div>
				{#each data.student.act as act}
					<div class="flex my-4 gap-4">
						<A on:click={actScoreModalOpener(act)}>Update ACT</A>
						<pre class="text-sm text-gray-500 bg-slate-100">{JSON.stringify(act, null, 2)}</pre>
					</div>
				{/each}
				<A class="text-sm font-medium" on:click={actScoreModalOpener()}>Add an ACT score</A>
			</div>

			<div>
				{#each data.student.gre as gre}
					<div class="flex my-4 gap-4">
						<A on:click={greScoreModalOpener(gre)}>Update GRE</A>
						<pre class="text-sm text-gray-500 bg-slate-100">{JSON.stringify(gre, null, 2)}</pre>
					</div>
				{/each}
				<A class="text-sm font-medium" on:click={greScoreModalOpener()}>Add a GRE score</A>
			</div>
		</article>
	</section>

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

<Button outline href={`/student/${data.student.id}/new-application`}>Create an application</Button>
