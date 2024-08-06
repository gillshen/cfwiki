<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		Heading,
		Hr,
		Button,
		Dropdown,
		Modal,
		Label,
		Select,
		P,
		A,
		Timeline,
		DropdownDivider
	} from 'flowbite-svelte';
	import { ChevronRightOutline } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms';

	import type { ApplicationLog } from '$lib/api/applicationLog';
	import { formatDueDateTime, toLongDate } from '$lib/utils/dateUtils';
	import LinkWithIcon from '$lib/components/links/LinkWithIcon.svelte';
	import RoundDatesForm from '$lib/components/round-dates-form/RoundDatesForm.svelte';
	import { getRoundNames } from '$lib/constants/applicationRounds';
	import ApplicationLogItem from '$lib/components/list-items/ApplicationLogItem.svelte';
	import ApplicationLogForm from '$lib/components/application-log-form/ApplicationLogForm.svelte';
	import DropdownActionItem from '$lib/components/list-items/DropdownActionItem.svelte';

	export let data;

	const { form: renameRoundForm, enhance: renameRoundEnhance } = superForm(data.renameRoundForm, {
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

	const { form: logForm, enhance: logEnhance } = superForm(data.logForm, {
		onUpdated({ form }) {
			if (form.valid) {
				logModal = false;
			}
		}
	});

	$: application = data.application;

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

	const changeRoundNotRename = () => {
		renameRoundModal = false;
		changeRoundModal = true;
	};
</script>

<Heading tag="h1" class="alt-page-title">Application {application.id}</Heading>

<Hr />

<section class="flex gap-24">
	<div class="w-[36rem] min-w-[32rem] pb-8">
		<Table>
			<TableBody>
				<TableBodyRow>
					<TableBodyCell tdClass="w-48 font-medium py-4">Student</TableBodyCell>
					<TableBodyCell tdClass="font-normal py-4">
						<LinkWithIcon
							href={`/student/${application.student.id}`}
							text={application.student.fullname}
						/>
					</TableBodyCell>
				</TableBodyRow>

				<TableBodyRow>
					<TableBodyCell tdClass="w-48 font-medium py-4">Term</TableBodyCell>
					<TableBodyCell tdClass="font-normal py-4">
						{application.program_iteration.term}
						{application.program_iteration.year}
					</TableBodyCell>
				</TableBodyRow>

				<TableBodyRow>
					<TableBodyCell tdClass="w-48 font-medium py-4">School</TableBodyCell>
					<TableBodyCell tdClass="font-normal py-4">
						<div class="flex flex-col">
							{#each application.schools as school}
								<LinkWithIcon href={`/school/${school.id}`} text={school.name} />
							{/each}
						</div>
					</TableBodyCell>
				</TableBodyRow>

				<TableBodyRow>
					<TableBodyCell tdClass="w-48 font-medium py-4">Program</TableBodyCell>
					<TableBodyCell tdClass="font-normal py-4">
						<LinkWithIcon
							href={`/program/${application.program.id}`}
							text={application.program.display_name}
						/>
					</TableBodyCell>
				</TableBodyRow>

				<TableBodyRow>
					<TableBodyCell tdClass="w-48 font-medium py-4">Appl. round</TableBodyCell>
					<TableBodyCell tdClass="font-normal py-4">{application.round.name}</TableBodyCell>
				</TableBodyRow>

				<TableBodyRow>
					<TableBodyCell tdClass="w-48 font-medium py-4">Due</TableBodyCell>
					<TableBodyCell tdClass="font-normal py-4">
						{formatDueDateTime(
							application.round.due_date,
							application.round.due_time,
							application.round.timezone
						)}
					</TableBodyCell>
				</TableBodyRow>

				<TableBodyRow>
					<TableBodyCell tdClass="w-48 font-medium py-4">Decision date</TableBodyCell>
					<TableBodyCell tdClass="font-normal py-4">
						{toLongDate(application.round.decision_date)}
					</TableBodyCell>
				</TableBodyRow>
			</TableBody>
		</Table>

		{#if canEdit}
			<div class="flex gap-x-8 mt-8">
				<Button outline>Actions<ChevronRightOutline class="w-6 h-6 ms-2" /></Button>
				<Dropdown class="w-40 z-20" placement="right-start">
					<DropdownActionItem text="Change round" onClick={() => (changeRoundModal = true)} />
					<DropdownActionItem text="Rename round" onClick={() => (renameRoundModal = true)} />
					<DropdownActionItem text="Update dates" onClick={() => (updateDatesModal = true)} />
					<DropdownActionItem text="Update majors" onClick={() => alert('update majors')} />
					<DropdownDivider />
					<DropdownActionItem text="Delete" onClick={() => alert('delete')} dark />
				</Dropdown>
			</div>
		{/if}
	</div>

	<div class="w-[36rem] min-w-[20rem]">
		<div class="mb-8">
			{#if canEdit || logs.length}
				<div class="bg-slate-50 rounded-xl px-4 py-4">
					{#if logs.length}
						<Timeline class="ml-2 mt-4">
							{#each logs as log}
								<ApplicationLogItem
									{log}
									updateAction={() => {
										activeLog = log;
										logModal = true;
									}}
									deleteAction={() => alert('delete')}
								/>
							{/each}
						</Timeline>
					{/if}
					{#if canEdit}
						<Button outline class="ml-2" on:click={() => (logModal = true)}>Add a status</Button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</section>

<Modal title="Change application round" bind:open={changeRoundModal} outsideclose>
	<form class="modal" method="post">
		<input type="number" name="id" class="hidden" bind:value={$renameRoundForm.id} />

		<div class="form-width mx-auto">
			<!-- TODO -->
		</div>
	</form>
</Modal>

<Modal title="Rename application round" bind:open={renameRoundModal} outsideclose>
	<form class="modal" method="post" action="?/updateRoundName" use:renameRoundEnhance>
		<input type="number" name="id" class="hidden" bind:value={$renameRoundForm.id} />

		<div class="form-width mx-auto">
			<div class="flex flex-col gap-2 mt-4">
				<P size="sm" color="text-gray-600">
					Renaming an application round will affect all applications targeting it. Do this only if
					you believe the current name is incorrect.
				</P>
				<P size="sm" color="text-gray-600">
					If you are trying to <strong>move</strong> the application to another round,
					<A on:click={changeRoundNotRename}>click here</A>.
				</P>
			</div>

			<Label for="round-name" class="form-label">Name</Label>
			<Select id="round-name" name="name" bind:value={$renameRoundForm.name} required>
				{#each getRoundNames(application.program.type) as roundName}
					<option value={roundName}>{roundName}</option>
				{/each}
			</Select>

			<Button type="submit" class="mt-8">Update</Button>
		</div>
	</form>
</Modal>

<Modal title="Update key dates" bind:open={updateDatesModal} outsideclose>
	<form class="modal" method="post" action="?/updateDates" use:datesUpdateEnhance>
		<div class="form-width mx-auto">
			<input type="number" name="id" class="hidden" bind:value={$datesUpdateForm.id} />
			<RoundDatesForm form={datesUpdateForm} />
		</div>
	</form>
</Modal>

<Modal title="Add an application status" bind:open={logModal} outsideclose>
	<form class="modal" method="post" action="?/createOrUpdateApplicationLog" use:logEnhance>
		<div class="form-width mx-auto">
			<input type="number" name="application" class="hidden" bind:value={application.id} />
			<ApplicationLogForm form={logForm} log={activeLog} />
		</div>
	</form>
</Modal>
