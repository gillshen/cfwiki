<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Heading, Timeline } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';

	import type { StudentDetail } from '$lib/api/student';

	import {
		orderByDateDesc,
		orderByProgressionDesc,
		type EnrollmentByStudent
	} from '$lib/api/enrollment';

	import EnrollmentItem from '$lib/components/list-items/EnrollmentItem.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import LinkButton from '$lib/components/buttons/LinkButton.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import EnrollmentForm from '$lib/components/enrollment-form/EnrollmentForm.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';

	export let student: StudentDetail;
	export let canEdit: boolean = false;
	export let form: SuperValidated<any>;
	export let deleteForm: SuperValidated<any>;

	let enrollmentModal = false;
	let enrollmentDeleteModal = false;
	let activeEnrollment: EnrollmentByStudent | null = null;

	const enrollmentModalOpener = (enrollment?: EnrollmentByStudent): (() => void) => {
		return () => {
			activeEnrollment = enrollment ?? null;
			enrollmentModal = true;
		};
	};
</script>

<article class="mt-24">
	<Heading tag="h2" class="text-2xl font-bold">Educational Experiences</Heading>

	{#if student.enrollments.length}
		<Timeline class="mt-8 flex flex-col gap-4">
			{#each student.enrollments.sort(orderByDateDesc).sort(orderByProgressionDesc) as enrollment}
				<EnrollmentItem {enrollment}>
					{#if canEdit}
						<UpdateDeleteButton
							updateAction={enrollmentModalOpener(enrollment)}
							deleteAction={() => {
								activeEnrollment = enrollment;
								enrollmentDeleteModal = true;
							}}
						/>
					{/if}
				</EnrollmentItem>
			{/each}
		</Timeline>
	{:else if !canEdit}
		<NoDataSign text="No educational experience" divClass="mt-6" />
	{/if}

	{#if canEdit}
		<div class="mt-8">
			<LinkButton text="Add an educational experience" action={enrollmentModalOpener()}>
				<PlusOutline slot="icon" />
			</LinkButton>
		</div>
	{/if}
</article>

<FormModal
	open={enrollmentModal}
	superform={form}
	fields={EnrollmentForm}
	action={`/student/${student.id}?/createOrUpdateEnrollment`}
	entity={activeEnrollment}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeEnrollment ? 'Update' : 'Add an'} educational experience`}
	on:close={() => (enrollmentModal = false)}
/>

<FormModal
	open={enrollmentDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/student/${student.id}?/deleteEnrollment`}
	entity={activeEnrollment}
	title="Delete educational experience"
	on:close={() => (enrollmentDeleteModal = false)}
>
	<DeleteMessage
		slot="preface"
		name={`this educational experience (at ${activeEnrollment?.school.name})`}
	/>
</FormModal>
