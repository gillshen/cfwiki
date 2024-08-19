<script lang="ts">
	import { Heading, A, Hr, Modal } from 'flowbite-svelte';
	import { PenOutline } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms';

	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import ApplicationInfobox from '$lib/components/infobox/ApplicationInfobox.svelte';

	import Main from '$lib/components/containers/Main.svelte';
	import MultiActionButton from '$lib/components/buttons/MultiActionButton.svelte';
	import RoundChangeForm from '$lib/components/round-name-form/RoundChangeForm.svelte';
	import RoundRenameForm from '$lib/components/round-name-form/RoundRenameForm.svelte';
	import RoundDatesForm from '$lib/components/round-dates-form/RoundDatesForm.svelte';
	import ApplicationUpdateForm from '$lib/components/application-update-form/ApplicationUpdateForm.svelte';
	import LogsSection from '$lib/components/application-page/LogsSection.svelte';
	import CoApplicationsSection from '$lib/components/application-page/CoApplicationsSection.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import { isUndergraduate } from '$lib/utils/programUtils';

	export let data;

	$: canEdit = true;

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

	let changeRoundModal = false;
	let renameRoundModal = false;
	let updateDatesModal = false;
	let updateMajorsModal = false;
	let deleteModal = false;

	const changeRoundIdNotName = () => {
		renameRoundModal = false;
		changeRoundModal = true;
	};

	const applicationActions = [
		{ text: 'Change round', action: () => (changeRoundModal = true) },
		{ text: 'Rename round', action: () => (renameRoundModal = true) },
		{ text: 'Update dates', action: () => (updateDatesModal = true), divider: true },
		{
			text: 'Update major(s)',
			action: () => (updateMajorsModal = true),
			disabled: !isUndergraduate(data.application.program)
		},
		{ text: 'Delete', action: () => (deleteModal = true), divider: true, dark: true }
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

	<LogsSection
		application={data.application}
		form={data.logForm}
		deleteForm={data.deleteForm}
		{canEdit}
	/>

	<CoApplicationsSection application={data.application} coApplications={data.coApplications} />
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
	open={updateMajorsModal}
	superform={data.applicationUpdateForm}
	fields={ApplicationUpdateForm}
	action="?/updateApplication"
	entity={data.application}
	title="Update majors"
	on:close={() => (updateMajorsModal = false)}
/>

<FormModal
	open={deleteModal}
	superform={data.deleteForm}
	fields={DeleteForm}
	action="?/deleteApplication"
	entity={data.application}
	title="Delete application"
	on:close={() => (deleteModal = false)}
>
	<DeleteMessage
		slot="preface"
		name={`this application${data.application.logs.length ? ', along with its status history,' : ''}`}
	/>
</FormModal>
