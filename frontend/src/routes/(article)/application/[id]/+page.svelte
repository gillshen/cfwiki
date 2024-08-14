<script lang="ts">
	import {
		Heading,
		A,
		Hr,
		Button,
		Modal,
		Timeline,
		Table,
		TableHead,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHeadCell
	} from 'flowbite-svelte';

	import { ArrowUpRightFromSquareOutline, PenOutline } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms';

	import type { ApplicationLog } from '$lib/api/applicationLog';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import ApplicationInfobox from '$lib/components/infobox/ApplicationInfobox.svelte';
	import ApplicationLogItem from '$lib/components/list-items/ApplicationLogItem.svelte';

	import Main from '$lib/components/containers/Main.svelte';
	import RoundRenameForm from '$lib/components/round-name-form/RoundRenameForm.svelte';
	import RoundDatesForm from '$lib/components/round-dates-form/RoundDatesForm.svelte';
	import ApplicationLogForm from '$lib/components/application-log-form/ApplicationLogForm.svelte';
	import MultiActionButton from '$lib/components/buttons/MultiActionButton.svelte';
	import RoundChangeForm from '$lib/components/round-name-form/RoundChangeForm.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import { isUndergraduate } from '$lib/api/program.js';
	import { formatCfNames } from '$lib/api/service';

	export let data;

	const { form: roundRenameForm, enhance: roundRenamEnhance } = superForm(data.roundRenameForm, {
		onUpdated({ form }) {
			if (form.valid) {
				renameRoundModal = false;
			}
		},
		// force update the form values
		invalidateAll: 'force'
	});

	const { form: datesUpdateForm, enhance: datesUpdateEnhance } = superForm(data.datesUpdateForm, {
		onUpdated({ form }) {
			if (form.valid) {
				updateDatesModal = false;
			}
		},
		// force update the form values
		invalidateAll: 'force'
	});

	$: logs = data.application.logs.sort((a: ApplicationLog, b: ApplicationLog) => {
		if (a.date !== b.date) {
			return a.date.localeCompare(b.date);
		} else {
			return a.updated.localeCompare(b.updated);
		}
	});

	$: canEdit = true;

	let changeRoundModal = false;
	let renameRoundModal = false;
	let updateDatesModal = false;

	let logModal = false;
	let activeLog: ApplicationLog | null = null;

	const changeRoundIdNotName = () => {
		renameRoundModal = false;
		changeRoundModal = true;
	};

	const logModalOpener = (log?: ApplicationLog): (() => void) => {
		return () => {
			activeLog = log ?? null;
			logModal = true;
		};
	};

	$: applicationActions = [
		{ text: 'Change round', action: () => (changeRoundModal = true) },
		{ text: 'Rename round', action: () => (renameRoundModal = true) },
		{ text: 'Update dates', action: () => (updateDatesModal = true) },
		{ text: 'Update majors', action: () => alert('update majors') },
		{ text: 'Delete', action: () => alert('delete application'), divider: true, dark: true }
	];
</script>

<Heading tag="h1" class="alt-page-title">
	<A href={`/student/${data.application.student.id}`}>{data.application.student.fullname}</A>
	| Application {data.application.id}
</Heading>

<Hr />

<Main>
	<article>
		<ApplicationInfobox application={data.application} />

		{#if canEdit}
			<div class="mt-8">
				<MultiActionButton text="Actions" actions={applicationActions}>
					<PenOutline slot="icon" />
				</MultiActionButton>
			</div>
		{/if}
	</article>

	<article class="w-full h-fit bg-slate-50 rounded-xl px-8 py-4">
		{#if canEdit || logs.length}
			{#if logs.length}
				<Timeline class="ml-2 mt-4">
					{#each logs as log}
						<ApplicationLogItem {log}>
							{#if canEdit}
								<div class="mt-2">
									<UpdateDeleteButton
										updateAction={logModalOpener(log)}
										deleteAction={() => alert('delete')}
									/>
								</div>
							{/if}
						</ApplicationLogItem>
					{/each}
				</Timeline>
			{:else if !canEdit}
				<NoDataSign text="No application status reported" divClass="ml-2 my-2" />
			{/if}
			{#if canEdit}
				<Button outline class="ml-2 my-2" on:click={logModalOpener()}>Add a status</Button>
			{/if}
		{/if}
	</article>

	<article class="col-span-2 mt-24">
		<ApplicationsLoader
			applications={data.coApplications}
			heading="Co-applicants"
			noDataText="No other applicants this year and term"
		>
			<svelte:fragment let:applications>
				<Table class="mt-8" hoverable={applications.length > 1}>
					<TableHead>
						<TableHeadCell></TableHeadCell>
						<TableHeadCell>Student</TableHeadCell>
						<TableHeadCell>顾问</TableHeadCell>
						<TableHeadCell>文案</TableHeadCell>
						{#if isUndergraduate(data.application.program)}
							<TableHeadCell>Major</TableHeadCell>
						{/if}
						<TableHeadCell>Round</TableHeadCell>
						<TableHeadCell>Status</TableHeadCell>
					</TableHead>

					<TableBody>
						{#each applications as appl}
							<TableBodyRow>
								<TableBodyCell class="w-4 pl-2">
									<A href={`/application/${appl.id}`}><ArrowUpRightFromSquareOutline /></A>
								</TableBodyCell>
								<TableBodyCell class="max-w-20">{appl.student.fullname}</TableBodyCell>
								<TableBodyCell class="font-normal">
									{formatCfNames(appl.services, '顾问') || '-'}
								</TableBodyCell>
								<TableBodyCell class="font-normal">
									{formatCfNames(appl.services, '文案') || '-'}
								</TableBodyCell>
								{#if isUndergraduate(appl.program)}
									<TableBodyCell class="font-normal">
										<span class="text-gray-400">TODO</span>
									</TableBodyCell>
								{/if}
								<TableBodyCell class="font-normal max-w-16">{appl.round.name}</TableBodyCell>
								<TableBodyCell class="">{appl.latest_log?.status ?? '-'}</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</svelte:fragment>
		</ApplicationsLoader>
	</article>
</Main>

<FormModal
	open={changeRoundModal}
	superform={data.roundChangeForm}
	fields={RoundChangeForm}
	action="?/updateRoundId"
	entity={data.application}
	title="Change application round"
	on:close={() => (changeRoundModal = false)}
/>

<Modal title="Rename application round" bind:open={renameRoundModal} outsideclose>
	<form class="modal" method="post" action="?/updateRoundName" use:roundRenamEnhance>
		<input type="number" name="id" class="hidden" bind:value={$roundRenameForm.id} />
		<div class="form-width mx-auto">
			<RoundRenameForm
				form={roundRenameForm}
				programType={data.application.program.type}
				redirectToRoundIdForm={changeRoundIdNotName}
			/>
		</div>
	</form>
</Modal>

<Modal title="Update key dates" bind:open={updateDatesModal} outsideclose>
	<form class="modal" method="post" action="?/updateRoundDates" use:datesUpdateEnhance>
		<input type="number" name="id" class="hidden" bind:value={$datesUpdateForm.id} />
		<div class="form-width mx-auto">
			<RoundDatesForm form={datesUpdateForm} />
		</div>
	</form>
</Modal>

<FormModal
	open={logModal}
	superform={data.logForm}
	fields={ApplicationLogForm}
	action="?/createOrUpdateApplicationLog"
	entity={activeLog}
	extra={[{ name: 'application', type: 'number', value: data.application.id }]}
	title={`${activeLog ? 'Update' : 'Add an'} application status`}
	on:close={() => (logModal = false)}
/>
