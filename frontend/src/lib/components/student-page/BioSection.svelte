<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SuperValidated } from 'sveltekit-superforms';

	import type { StudentDetail } from '$lib/api/student';
	import StudentInfobox from '$lib/components/infobox/StudentInfobox.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';

	export let student: StudentDetail;
	export let canEdit: boolean = false;
	export let deleteForm: SuperValidated<any>;

	let deleteModal = false;
</script>

<article>
	<StudentInfobox {student} />

	{#if canEdit}
		<div class="mt-8">
			<UpdateDeleteButton
				text="Actions"
				updateAction={() => goto(`${student.id}/update`)}
				deleteAction={() => (deleteModal = true)}
			/>
		</div>
	{/if}
</article>

<FormModal
	open={deleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteStudent`}
	entity={student}
	title="Delete student file"
	on:close={() => (deleteModal = false)}
>
	<DeleteMessage
		slot="preface"
		name={`this student (${student.fullname}), along with all related data including contracts, educational experiences, test scores, and applications,`}
	/>
</FormModal>
