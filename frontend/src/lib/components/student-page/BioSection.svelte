<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { PenOutline } from 'flowbite-svelte-icons';

	import type { StudentDetail } from '$lib/api/student';
	import StudentInfobox from '$lib/components/infobox/StudentInfobox.svelte';
	import GotoButton from '$lib/components/buttons/GotoButton.svelte';
	import DeleteButton from '$lib/components/buttons/DeleteButton.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';

	export let student: StudentDetail;
	export let canEdit: boolean = false;
	export let deleteForm: SuperValidated<any>;

	let deleteModal = false;
</script>

<StudentInfobox {student} />

{#if canEdit}
	<div class="mt-3 flex gap-4">
		<GotoButton href={`${student.id}/update`} text="Update" icon={PenOutline} />
		<DeleteButton onClick={() => (deleteModal = true)} />
	</div>
{/if}

<FormModal
	open={deleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteStudent`}
	entity={student}
	title="Delete student profile"
	on:close={() => (deleteModal = false)}
>
	<DeleteMessage
		slot="preface"
		name={`this student (${student.fullname}), along with all related data including contracts, educational experiences, test scores, and applications,`}
	/>
</FormModal>
