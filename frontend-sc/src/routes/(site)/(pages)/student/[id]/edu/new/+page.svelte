<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as StudentPage from '$lib/components/widgets/student-page/index';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import NewEnrollmentForm from '$lib/components/forms/enrollment-form/NewEnrollmentForm.svelte';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;
</script>

<svelte:head>
	<title>{createTitle(`${data.student.fullname} | Create Educational Experience`)}</title>
</svelte:head>

<StudentPage.Layout>
	<svelte:fragment slot="breadcrumb">
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/student/{data.student.id}">{data.student.fullname}</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page>New Experience</Breadcrumb.Page>
		</Breadcrumb.Item>
	</svelte:fragment>

	<StudentPage.Header student={data.student} slot="header" />

	<h3 class="pb-2 pt-[72px] px-6 text-sm text-muted-foreground">Create Educational Experience</h3>

	<section class="border rounded-xl px-12 py-4 bg-white max-w-prose w-fit">
		{#await data.schools}
			<LoadingSign />
		{:then schools}
			<NewEnrollmentForm
				data={data.newEnrollmentForm}
				studentId={data.student.id}
				{schools}
				newSchoolForm={data.newSchoolForm}
				class="ml-0"
				onUpdated={() => console.log('success')}
			/>
		{/await}
	</section>
</StudentPage.Layout>
