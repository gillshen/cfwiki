<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Heading, Timeline } from 'flowbite-svelte';

	import type { StudentDetail } from '$lib/api/student';
	import type { EnrollmentByStudent } from '$lib/api/enrollment';
	import type { School } from '$lib/api/school';
	import EnrollmentItem from '$lib/components/list-items/EnrollmentItem.svelte';
	import AddButton from '$lib/components/buttons/AddButton.svelte';
	import UpdateButton from '$lib/components/buttons/UpdateButton.svelte';
	import DeleteButton from '$lib/components/buttons/DeleteButton.svelte';
	import GotoButton from '$lib/components/buttons/GotoButton.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import EnrollmentForm from '$lib/components/enrollment-form/EnrollmentForm.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';

	export let student: StudentDetail;
	export let canEdit: boolean = false;
	export let form: SuperValidated<any>;
	export let deleteForm: SuperValidated<any>;
	export let promisedSchools: Promise<School[]>;

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

<Heading tag="h2" class="section-title">Educational Experiences</Heading>

{#if student.enrollments.length}
	<Timeline class="mt-6 flex flex-col gap-4 max-w-lg">
		{#each student.enrollments as enrollment}
			<EnrollmentItem {enrollment}>
				<div class="mt-8 flex gap-4 items-baseline justify-between pr-2">
					{#if canEdit}
						<div class="flex gap-4 items-baseline">
							<UpdateButton onClick={enrollmentModalOpener(enrollment)} />
							<DeleteButton
								onClick={() => {
									activeEnrollment = enrollment;
									enrollmentDeleteModal = true;
								}}
							/>
						</div>
					{/if}
					<GotoButton
						href={`/grades/${enrollment.id}`}
						text={canEdit ? 'Manage Grades' : 'Grade Details'}
					/>
				</div>
			</EnrollmentItem>
		{/each}
	</Timeline>
{:else if !canEdit}
	<NoDataSign text="None" divClass="mt-6" />
{/if}

{#if canEdit}
	<div class="mt-6">
		<AddButton onClick={enrollmentModalOpener()} text="Add an Educational Experience" />
	</div>
{/if}

<FormModal
	open={enrollmentModal}
	superform={form}
	fields={EnrollmentForm}
	action={`/student/${student.id}?/createOrUpdateEnrollment`}
	entity={activeEnrollment}
	extra={[{ name: 'student', type: 'number', value: student.id }]}
	title={`${activeEnrollment ? 'Update' : 'Add an'} educational experience`}
	{promisedSchools}
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
		name={`this educational experience (${activeEnrollment?.school.name})`}
	/>
</FormModal>
