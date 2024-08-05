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
		DropdownItem,
		Modal,
		Label,
		Select,
		P,
		A
	} from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms';

	import { formatDueDateTime, toLongDate } from '$lib/utils/dateUtils';
	import LinkWithIcon from '$lib/components/links/LinkWithIcon.svelte';
	import RoundDatesForm from '$lib/components/round-dates-form/RoundDatesForm.svelte';
	import { getRoundNames } from '$lib/constants/applicationRounds';

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

	$: application = data.application;

	let changeRoundModal = false;
	let renameRoundModal = false;
	let updateDatesModal = false;
</script>

<Heading tag="h1" class="alt-page-title">Application {data.application.id}</Heading>

<Hr />

<div class="w-[36rem] pb-8">
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
</div>

{#if true}
	<div class="flex gap-4">
		<Button outline>Update<ChevronDownOutline class="w-6 h-6 ms-2" /></Button>
		<Dropdown>
			<DropdownItem class="text-primary-700" on:click={() => (changeRoundModal = true)}>
				Move to another round
			</DropdownItem>
			<DropdownItem class="text-primary-700" on:click={() => (renameRoundModal = true)}>
				Rename the current round
			</DropdownItem>
			<DropdownItem class="text-primary-700" on:click={() => (updateDatesModal = true)}>
				Set dates
			</DropdownItem>
		</Dropdown>

		<Button outline color="dark">Delete</Button>
	</div>
{/if}

<Modal title="Move to another round" bind:open={changeRoundModal} outsideclose>
	<form class="modal" method="post">
		<input type="number" name="id" class="hidden" bind:value={$renameRoundForm.id} />

		<div class="form-width mx-auto"></div>
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
					<A
						on:click={() => {
							renameRoundModal = false;
							changeRoundModal = true;
						}}
					>
						click here
					</A>.
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

<Modal title="Update important dates" bind:open={updateDatesModal} outsideclose>
	<form class="modal" method="post" action="?/updateDates" use:datesUpdateEnhance>
		<div class="form-width mx-auto">
			<input type="number" name="id" class="hidden" bind:value={$datesUpdateForm.id} />
			<RoundDatesForm form={datesUpdateForm} />
		</div>
	</form>
</Modal>
