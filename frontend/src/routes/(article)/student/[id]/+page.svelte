<script lang="ts">
	import { goto } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms';
	import { Button, Heading, Hr, Dropdown, A, Timeline, Modal } from 'flowbite-svelte';
	import {
		ChevronRightOutline,
		PenOutline,
		ArrowUpRightFromSquareOutline
	} from 'flowbite-svelte-icons';

	import StudentInfobox from '$lib/components/infobox/StudentInfobox.svelte';
	import DropdownActionItem from '$lib/components/list-items/DropdownActionItem.svelte';

	import type { Contract } from '$lib/api/contract';
	import ContractForm from '$lib/components/contract-form/ContractForm.svelte';
	import ContractItem from '$lib/components/list-items/ContractItem.svelte';

	import type { Enrollment } from '$lib/api/student.js';
	import EnrollmentForm from '$lib/components/enrollment-form/EnrollmentForm.svelte';
	import EnrollmentItem from '$lib/components/list-items/EnrollmentItem.svelte';

	import type { ActScore, IeltsScore, SatScore, ToeflScore } from '$lib/api/scores';
	import ToeflScoreForm from '$lib/components/toefl-score-form/ToeflScoreForm.svelte';
	import IeltsScoreForm from '$lib/components/ielts-score-form/IeltsScoreForm.svelte';
	import SatScoreForm from '$lib/components/sat-score-form/SatScoreForm.svelte';
	import ActScoreForm from '$lib/components/act-score-form/ActScoreForm.svelte';

	export let data;

	const { form: contractForm, enhance: contractEnhance } = superForm(data.contractForm, {
		onUpdated({ form }) {
			if (form.valid) {
				contractModal = false;
			}
		}
	});

	const { form: enrollmentForm, enhance: enrollmentEnhance } = superForm(data.enrollmentForm, {
		onUpdated({ form }) {
			if (form.valid) {
				enrollmentModal = false;
			}
		}
	});

	const { form: toeflForm, enhance: toeflEnhance } = superForm(data.toeflForm, {
		id: 'toefl',
		onUpdated({ form }) {
			if (form.valid) {
				toeflModal = false;
			}
		}
	});

	const { form: ieltsForm, enhance: ieltsEnhance } = superForm(data.ieltsForm, {
		id: 'ielts',
		onUpdated({ form }) {
			if (form.valid) {
				ieltsModal = false;
			}
		}
	});

	const { form: satScoreForm, enhance: satScoreEnhance } = superForm(data.satScoreForm, {
		onUpdated({ form }) {
			if (form.valid) {
				satScoreModal = false;
			}
		}
	});

	const { form: actScoreForm, enhance: actScoreEnhance } = superForm(data.actScoreForm, {
		onUpdated({ form }) {
			if (form.valid) {
				actScoreModal = false;
			}
		}
	});

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
								<div class="text-sm mt-4 flex gap-2">
									<A on:click={enrollmentModalOpener(enrollment)}><PenOutline /></A>
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
		</article>
	</section>

	<article class="bg-slate-50 rounded-xl w-full min-w-[32rem] h-fit p-8 text-gray-400">
		{#if data.student.contracts_sorted.length}
			<div class="flex gap-8 mb-8">
				{#each data.student.contracts_sorted as contract}
					<ContractItem {contract}>
						{#if canEdit || !contract.services.length}
							<div class="mt-8 flex gap-6">
								<A class="text-sm" on:click={contractModalOpener(contract)}><PenOutline /></A>
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

<Modal
	title={`${activeContract ? 'Update' : 'Create a'} contract`}
	bind:open={contractModal}
	outsideclose
>
	<form class="modal" method="post" action="?/createOrUpdateContract" use:contractEnhance>
		<input class="hidden" type="number" name="student" bind:value={data.student.id} />
		<div class="form-width mx-auto">
			<ContractForm
				form={contractForm}
				contract={activeContract}
				submitButtonText={activeContract ? 'Update' : 'Submit'}
			/>
		</div>
	</form>
</Modal>

<Modal
	title={`${activeEnrollment ? 'Update' : 'Add'} education experience`}
	bind:open={enrollmentModal}
	outsideclose
>
	<form class="modal" method="post" action="?/createOrUpdateEnrollment" use:enrollmentEnhance>
		<input class="hidden" type="number" name="student" bind:value={data.student.id} />
		<div class="form-width mx-auto">
			<EnrollmentForm form={enrollmentForm} schools={data.schools} enrollment={activeEnrollment} />
		</div>
	</form>
</Modal>

<Modal
	title={`${activeToefl ? 'Update' : 'Add a'} TOEFL score`}
	bind:open={toeflModal}
	outsideclose
>
	<form class="modal" method="post" action="?/createOrUpdateToeflScore" use:toeflEnhance>
		<input class="hidden" type="number" name="student" bind:value={data.student.id} />
		<div class="form-width mx-auto">
			<ToeflScoreForm form={toeflForm} score={activeToefl} />
		</div>
	</form>
</Modal>

<Modal
	title={`${activeIelts ? 'Update' : 'Add an'} IELTS score`}
	bind:open={ieltsModal}
	outsideclose
>
	<form class="modal" method="post" action="?/createOrUpdateIeltsScore" use:ieltsEnhance>
		<input class="hidden" type="number" name="student" bind:value={data.student.id} />
		<div class="form-width mx-auto">
			<IeltsScoreForm form={ieltsForm} score={activeIelts} />
		</div>
	</form>
</Modal>

<Modal
	title={`${activeSatScore ? 'Update' : 'Add a'} SAT score`}
	bind:open={satScoreModal}
	outsideclose
>
	<form class="modal" method="post" action="?/createOrUpdateSatScore" use:satScoreEnhance>
		<input class="hidden" type="number" name="student" bind:value={data.student.id} />
		<div class="form-width mx-auto">
			<SatScoreForm form={satScoreForm} score={activeSatScore} />
		</div>
	</form>
</Modal>

<Modal
	title={`${activeActScore ? 'Update' : 'Add an'} ACT score`}
	bind:open={actScoreModal}
	outsideclose
>
	<form class="modal" method="post" action="?/createOrUpdateActScore" use:actScoreEnhance>
		<input class="hidden" type="number" name="student" bind:value={data.student.id} />
		<div class="form-width mx-auto">
			<ActScoreForm form={actScoreForm} score={activeActScore} />
		</div>
	</form>
</Modal>

<Hr />

<Button outline href={`/student/${data.student.id}/new-application`}>Create an application</Button>
