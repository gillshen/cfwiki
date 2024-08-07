<script lang="ts">
	import {
		Heading,
		A,
		Hr,
		Button,
		Dropdown,
		Modal,
		Timeline,
		DropdownDivider
	} from 'flowbite-svelte';
	import { ChevronRightOutline } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms';

	import type { ApplicationLog } from '$lib/api/applicationLog';
	import ApplicationInfobox from '$lib/components/infobox/ApplicationInfobox.svelte';
	import DropdownActionItem from '$lib/components/list-items/DropdownActionItem.svelte';
	import ApplicationLogItem from '$lib/components/list-items/ApplicationLogItem.svelte';

	import RoundNameForm from '$lib/components/round-name-form/RoundNameForm.svelte';
	import RoundDatesForm from '$lib/components/round-dates-form/RoundDatesForm.svelte';
	import ApplicationLogForm from '$lib/components/application-log-form/ApplicationLogForm.svelte';

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

	const { form: logForm, enhance: logEnhance } = superForm(data.logForm, {
		onUpdated({ form }) {
			if (form.valid) {
				logModal = false;
			}
		}
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
</script>

<Heading tag="h1" class="alt-page-title">
	<A href={`/student/${data.application.student.id}`}>{data.application.student.fullname}</A>
	| Application {data.application.id}
</Heading>

<Hr />

<section class="flex gap-24">
	<article class="w-[36rem] min-w-[32rem] pb-8">
		<ApplicationInfobox application={data.application} />

		{#if canEdit}
			<div class="flex gap-x-8 mt-8">
				<Button outline>Actions<ChevronRightOutline class="w-6 h-6 ms-1" /></Button>
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
	</article>

	<article class="w-[36rem] min-w-[20rem]">
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
						<Button
							outline
							class="ml-2"
							on:click={() => {
								activeLog = null;
								logModal = true;
							}}
						>
							Add a status
						</Button>
					{/if}
				</div>
			{/if}
		</div>
	</article>
</section>

<Modal title="Change application round" bind:open={changeRoundModal} outsideclose>
	<form class="modal" method="post">
		<input type="number" name="id" class="hidden" bind:value={$roundRenameForm.id} />
		<div class="form-width mx-auto">
			<!-- TODO -->
		</div>
	</form>
</Modal>

<Modal title="Rename application round" bind:open={renameRoundModal} outsideclose>
	<form class="modal" method="post" action="?/updateRoundName" use:roundRenamEnhance>
		<input type="number" name="id" class="hidden" bind:value={$roundRenameForm.id} />

		<div class="form-width mx-auto">
			<RoundNameForm
				form={roundRenameForm}
				programType={data.application.program.type}
				redirectToRoundIdForm={changeRoundIdNotName}
			/>
		</div>
	</form>
</Modal>

<Modal title="Update key dates" bind:open={updateDatesModal} outsideclose>
	<form class="modal" method="post" action="?/updateDates" use:datesUpdateEnhance>
		<input type="number" name="id" class="hidden" bind:value={$datesUpdateForm.id} />
		<div class="form-width mx-auto">
			<RoundDatesForm form={datesUpdateForm} />
		</div>
	</form>
</Modal>

<Modal title="Add an application status" bind:open={logModal} outsideclose>
	<form class="modal" method="post" action="?/createOrUpdateApplicationLog" use:logEnhance>
		<input type="number" name="application" class="hidden" bind:value={data.application.id} />
		<div class="form-width mx-auto">
			<ApplicationLogForm form={logForm} log={activeLog} />
		</div>
	</form>
</Modal>
