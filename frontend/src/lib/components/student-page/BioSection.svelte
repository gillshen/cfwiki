<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Alert } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';

	import type { StudentDetail } from '$lib/api/student';
	import StudentInfobox from '$lib/components/infobox/StudentInfobox.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';

	export let student: StudentDetail;
	export let canEdit: boolean = false;
	export let deleteForm: SuperValidated<any>;

	const pronoun = student.gender === 'male' ? 'him' : student.gender === 'female' ? 'her' : 'them';

	let deleteModal = false;
</script>

<article>
	{#if !student.contracts_sorted.length}
		<Alert color="yellow" class="mb-4 flex gap-2">
			<InfoCircleSolid />
			<span>
				This student has no contract associated with {pronoun} and consequently does not appear on any
				CFer&rsquo;s page. If this is your student, please claim {pronoun} by adding a contract and then
				adding yourself to the staff.
			</span>
		</Alert>
	{:else if !student.contracts_sorted.filter((c) => !!c.services.length).length}
		<Alert color="yellow" class="mb-4 flex gap-2">
			<InfoCircleSolid />
			<span>
				This student has not been &ldquo;claimed&rdquo; by any CFer. If this is your student, please
				claim {pronoun} as yours by adding yourself to the staff of a contract.
			</span>
		</Alert>
	{/if}

	<StudentInfobox {student} />

	{#if canEdit}
		<div class="mt-3">
			<UpdateDeleteButton
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
	title="Delete student profile"
	on:close={() => (deleteModal = false)}
>
	<DeleteMessage
		slot="preface"
		name={`this student (${student.fullname}), along with all related data including contracts, educational experiences, test scores, and applications,`}
	/>
</FormModal>
