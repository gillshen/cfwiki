<script lang="ts">
	import { Heading, Hr } from 'flowbite-svelte';

	import Main from '$lib/components/containers/Main.svelte';
	import BioSection from '$lib/components/student-page/BioSection.svelte';
	import ContractSection from '$lib/components/student-page/ContractSection.svelte';
	import EducationSection from '$lib/components/student-page/EducationSection.svelte';
	import ScoresSection from '$lib/components/student-page/ScoresSection.svelte';
	import ApplicationsSection from '$lib/components/student-page/ApplicationsSection.svelte';

	export let data;

	$: canEdit = true;
</script>

<Heading tag="h1" class="alt-page-title">{data.student.fullname}</Heading>

<Hr />

<Main>
	<BioSection student={data.student} {canEdit} />

	<ContractSection
		student={data.student}
		{canEdit}
		form={data.contractForm}
		deleteForm={data.deleteForm}
	/>

	<EducationSection
		student={data.student}
		{canEdit}
		form={data.enrollmentForm}
		deleteForm={data.deleteForm}
	/>

	<ScoresSection
		student={data.student}
		{canEdit}
		greScoreForm={data.greScoreForm}
		satScoreForm={data.satScoreForm}
		actScoreForm={data.actScoreForm}
		toeflForm={data.toeflForm}
		ieltsForm={data.ieltsForm}
		duolingoForm={data.duolingoForm}
		apScoreForm={data.apScoreForm}
		ibGradeForm={data.ibGradeForm}
		alevelGradeForm={data.alevelGradeForm}
		deleteForm={data.deleteForm}
	/>

	<ApplicationsSection student={data.student} applications={data.applications} {canEdit} />
</Main>
