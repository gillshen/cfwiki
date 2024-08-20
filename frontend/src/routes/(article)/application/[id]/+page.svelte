<script lang="ts">
	import { Heading, A, Hr, Modal } from 'flowbite-svelte';
	import { PenOutline } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms';

	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import ApplicationInfobox from '$lib/components/infobox/ApplicationInfobox.svelte';
	import Main from '$lib/components/containers/Main.svelte';
	import MultiActionButton from '$lib/components/buttons/MultiActionButton.svelte';
	import RoundChangeForm from '$lib/components/application-update-form/RoundChangeForm.svelte';
	import RoundRenameForm from '$lib/components/application-round-form/RoundRenameForm.svelte';
	import RoundDatesForm from '$lib/components/round-dates-form/RoundDatesForm.svelte';
	import MajorsForm from '$lib/components/application-update-form/MajorsForm.svelte';
	import CommentsForm from '$lib/components/application-update-form/CommentsForm.svelte';
	import LogsSection from '$lib/components/application-page/LogsSection.svelte';
	import CoApplicationsSection from '$lib/components/application-page/CoApplicationsSection.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import Toast from '$lib/components/misc/Toast.svelte';
	import { isUndergraduate } from '$lib/utils/programUtils';

	export let data;

	$: canEdit = true;

	const { form: roundRenameForm, enhance: roundRenamEnhance } = superForm(data.roundRenameForm, {
		onUpdated({ form }) {
			if (form.valid) {
				roundRenameModal = false;
			} else {
				showRoundRenameError = true;
			}
		},
		// force update the form values
		invalidateAll: 'force'
	});

	const { form: datesUpdateForm, enhance: datesUpdateEnhance } = superForm(data.datesUpdateForm, {
		onUpdated({ form }) {
			if (form.valid) {
				datesUpdateModal = false;
			}
		},
		// force update the form values
		invalidateAll: 'force'
	});

	let roundChangeModal = false;
	let roundRenameModal = false;
	let datesUpdateModal = false;
	let majorsUpdateModal = false;
	let commentsUpdateModal = false;
	let deleteModal = false;

	let showRoundRenameError = false;

	const changeRoundIdNotName = () => {
		roundRenameModal = false;
		roundChangeModal = true;
	};

	const applicationActions = [
		{ text: 'Change round', action: () => (roundChangeModal = true) },
		{
			text: 'Update majors',
			action: () => (majorsUpdateModal = true),
			disabled: !isUndergraduate(data.application.program),
			divider: true
		},
		{ text: 'Update round name', action: () => (roundRenameModal = true) },
		{ text: 'Update dates', action: () => (datesUpdateModal = true) },
		{ text: 'Update comments', action: () => (commentsUpdateModal = true) },
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
	open={roundChangeModal}
	superform={data.roundChangeForm}
	fields={RoundChangeForm}
	action="?/updateRoundId"
	entity={data.application}
	title="Change application round"
	on:close={() => (roundChangeModal = false)}
/>

<Modal title="Rename application round" bind:open={roundRenameModal} outsideclose>
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

<Modal title="Update key dates" bind:open={datesUpdateModal} outsideclose>
	<form class="modal" method="post" action="?/updateRoundDates" use:datesUpdateEnhance>
		<input type="number" name="id" class="hidden" bind:value={$datesUpdateForm.id} />
		<div class="form-width mx-auto">
			<RoundDatesForm form={datesUpdateForm} />
		</div>
	</form>
</Modal>

<FormModal
	open={majorsUpdateModal}
	superform={data.majorsUpdateForm}
	fields={MajorsForm}
	action="?/updateMajors"
	entity={data.application}
	title="Update majors"
	on:close={() => (majorsUpdateModal = false)}
/>

<FormModal
	open={commentsUpdateModal}
	superform={data.commentsUpdateForm}
	fields={CommentsForm}
	action="?/updateComments"
	entity={data.application}
	title="Update comments"
	on:close={() => (commentsUpdateModal = false)}
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

{#if showRoundRenameError}
	<Toast type="error" onClose={() => (showRoundRenameError = false)}>
		Operation failed, possibly because the name has already been taken.
	</Toast>
{/if}
