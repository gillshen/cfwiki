<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Heading, Timeline } from 'flowbite-svelte';
	import { PlusOutline, CircleMinusOutline } from 'flowbite-svelte-icons';

	import type { StudentDetail } from '$lib/api/student';
	import type { Enrollment } from '$lib/api/enrollment';
	import EnrollmentItem from '$lib/components/list-items/EnrollmentItem.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import LinkButton from '$lib/components/buttons/LinkButton.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import EnrollmentForm from '$lib/components/enrollment-form/EnrollmentForm.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';

	export let student: StudentDetail;
	export let canEdit: boolean = false;
	export let form: SuperValidated<any>;

	let enrollmentModal = false;
	let activeEnrollment: Enrollment | null = null;

	const enrollmentModalOpener = (enrollment?: Enrollment): (() => void) => {
		return () => {
			activeEnrollment = enrollment ?? null;
			enrollmentModal = true;
		};
	};
</script>

<article class="mt-24">
	<Heading tag="h2" class="text-2xl font-bold">Educational Experience</Heading>

	{#if student.enrollments.length}
		<Timeline class="mt-8 flex flex-col gap-4">
			{#each student.enrollments as enrollment}
				<EnrollmentItem {enrollment}>
					{#if canEdit}
						<UpdateDeleteButton
							updateAction={enrollmentModalOpener(enrollment)}
							deleteAction={() => alert('delete enrollment')}
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
			<LinkButton text="Add educational experience" action={enrollmentModalOpener()}>
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
	title={`${activeEnrollment ? 'Update' : 'Add'} education experience`}
	on:close={() => (enrollmentModal = false)}
/>
