<script lang="ts">
	import { writable } from 'svelte/store';
	import { Heading, Hr } from 'flowbite-svelte';

	import { canEditStudent } from '$lib/utils/userUtils';
	import Main from '$lib/components/containers/Main.svelte';
	import BioSection from '$lib/components/student-page/BioSection.svelte';
	import ContractsSection from '$lib/components/student-page/ContractsSection.svelte';
	import EducationSection from '$lib/components/student-page/EducationSection.svelte';
	import ScoresSection from '$lib/components/student-page/ScoresSection.svelte';
	import ApplicationsSection from '$lib/components/student-page/ApplicationsSection.svelte';
	import StudentAlert from '$lib/components/student-page/StudentAlert.svelte';

	export let data;

	const contractModal = writable(false);

	$: canEdit = canEditStudent(data.username, data.student);
</script>

<Heading tag="h1" class="alt-page-title">{data.student.fullname}</Heading>

<Hr />

<Main>
	<BioSection student={data.student} {canEdit} deleteForm={data.deleteForm}>
		<StudentAlert student={data.student} addContract={() => contractModal.set(true)} />
	</BioSection>

	<ContractsSection
		student={data.student}
		username={data.username}
		form={data.contractForm}
		deleteForm={data.deleteForm}
		{contractModal}
	/>

	<EducationSection
		student={data.student}
		{canEdit}
		form={data.enrollmentForm}
		deleteForm={data.deleteForm}
		promisedSchools={data.promisedSchools}
	/>

	<ScoresSection
		student={data.student}
		{canEdit}
		scoreForms={data.scoreForms}
		deleteForm={data.deleteForm}
	/>

	<ApplicationsSection
		student={data.student}
		applications={data.applications}
		applicants={data.applicants}
		form={data.newApplicationPrepForm}
		{canEdit}
	/>
</Main>
