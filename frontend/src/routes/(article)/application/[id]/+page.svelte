<script lang="ts">
	import { Heading, A, Hr, Modal, Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';

	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import ApplicationInfobox from '$lib/components/infobox/ApplicationInfobox.svelte';
	import Main from '$lib/components/containers/Main.svelte';
	import MultiActionButton from '$lib/components/buttons/MultiActionButton.svelte';
	import UpdateDeleteIcon from '$lib/components/buttons/UpdateDeleteIcon.svelte';
	import RoundChangeForm from '$lib/components/application-update-form/RoundChangeForm.svelte';
	import RoundUpdateDialog from '$lib/components/application-round-form/RoundUpdateDialog.svelte';
	import MajorsForm from '$lib/components/application-update-form/MajorsForm.svelte';
	import TrackForm from '$lib/components/application-update-form/TrackForm.svelte';
	import CommentsForm from '$lib/components/application-update-form/CommentsForm.svelte';
	import LogsSection from '$lib/components/application-page/LogsSection.svelte';
	import CoApplicationsSection from '$lib/components/application-page/CoApplicationsSection.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import Toast from '$lib/components/misc/Toast.svelte';
	import BreadcrumbLink from '$lib/components/misc/BreadcrumbLink.svelte';
	import { isUndergraduate } from '$lib/utils/programUtils';

	export let data;

	$: canEdit = data.staffList.includes(data.username);

	let roundChangeModal = false;
	let roundUpdateModal = false;
	let majorsUpdateModal = false;
	let trackUpdateModal = false;
	let commentsUpdateModal = false;
	let deleteModal = false;

	let showRoundRenameError = false;

	const redirectToRoundChange = () => {
		roundUpdateModal = false;
		roundChangeModal = true;
	};

	const isUndergad = isUndergraduate(data.application.program);

	const applicationActions = [
		{ text: 'Change admission plan', action: () => (roundChangeModal = true) },
		{ text: 'Update admission plan', action: () => (roundUpdateModal = true) },
		{
			text: isUndergad ? 'Update majors' : 'Update track',
			action: isUndergad ? () => (majorsUpdateModal = true) : () => (trackUpdateModal = true),
			divider: true
		},
		{ text: 'Update comments', action: () => (commentsUpdateModal = true) },
		{ text: 'Delete', action: () => (deleteModal = true), divider: true, dark: true }
	];
</script>

<Heading tag="h1" class="alt-page-title">
	{data.application.student.fullname} | Application {data.application.id}
</Heading>

<Hr />

<Main>
	<article>
		<Breadcrumb class="mb-8">
			<BreadcrumbLink
				text={data.application.student.fullname}
				href={`/student/${data.application.student.id}`}
			/>
			<BreadcrumbItem>Application {data.application.id}</BreadcrumbItem>
		</Breadcrumb>

		<ApplicationInfobox application={data.application} />

		{#if canEdit}
			<div class="mt-3">
				<MultiActionButton actions={applicationActions}>
					<UpdateDeleteIcon slot="icon" />
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

	<CoApplicationsSection coApplications={data.coApplications} applicants={data.applicants} />
</Main>

<FormModal
	open={roundChangeModal}
	superform={data.roundChangeForm}
	fields={RoundChangeForm}
	action="?/updateRoundId"
	entity={data.application}
	title="Change admission plan"
	promisedRounds={data.promisedRounds}
	on:close={() => (roundChangeModal = false)}
/>

<Modal title="Update admission plan" bind:open={roundUpdateModal} outsideclose>
	<div class="form-width mx-auto">
		<RoundUpdateDialog
			programId={data.application.program.id}
			roundId={data.application.round.id}
			applicationId={data.application.id}
			{redirectToRoundChange}
		/>
	</div>
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
	open={trackUpdateModal}
	superform={data.trackUpdateForm}
	fields={TrackForm}
	action="?/updateTrack"
	entity={data.application}
	title="Update track, concentration, etc."
	on:close={() => (trackUpdateModal = false)}
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
