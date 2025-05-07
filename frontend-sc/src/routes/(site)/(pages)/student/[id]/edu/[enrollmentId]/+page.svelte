<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import Calendar from 'lucide-svelte/icons/calendar';
	import GraduationCap from 'lucide-svelte/icons/graduation-cap';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import PencilEditButton from '$lib/components/misc/PencilEditButton.svelte';
	import EnrollmentForm from '$lib/components/forms/enrollment-form/EnrollmentUpdateForm.svelte';

	import { createTitle } from '$lib/util/siteUtils';
	import { formatEnrollmentDates } from '$lib/util/enrollmentUtils';
	import { toShortYearMonth } from '$lib/util/dateUtils';

	export let data;

	let enrollmentUpdateModal = false;
</script>

<svelte:head>
	<title>{createTitle(`${data.student.fullname} @ ${data.enrollment.school.name}`)}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/student/index">Students</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/student/{data.student.id}">{data.student.fullname}</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page
			>@ {data.enrollment.school.alt_name || data.enrollment.school.name}</Breadcrumb.Page
		>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<section class="w-fit min-w-[60ch] mb-2 space-y-2 pb-4">
	<h1 class="page-title flex items-center gap-1">
		{data.student.fullname}
		<span class="scale-[80%]">@</span>
		{data.enrollment.school.name}
	</h1>
	<div class="flex flex-col gap-2 text-sm">
		<div class="flex items-center gap-1.5">
			<Calendar class="size-4" />
			{formatEnrollmentDates(data.enrollment, toShortYearMonth)}
		</div>
		{#if data.enrollment.curriculum}
			<div class="flex items-center gap-1.5">
				<GraduationCap class="size-4" />
				<div>{data.enrollment.curriculum}</div>
			</div>
		{/if}
		<div class="=w-fit">
			<ButtonDialog
				buttonSlot
				dialogTitle="Update Educational Experience"
				bind:open={enrollmentUpdateModal}
			>
				<PencilEditButton slot="button" class="p-0 m-0" iconClass="mr-1.5" />
				<EnrollmentForm
					data={data.enrollmentForm}
					enrollment={{ ...data.enrollment, school: data.enrollment.school.id }}
					onUpdated={({ form }) => form.valid && (enrollmentUpdateModal = false)}
				/>
			</ButtonDialog>
		</div>
	</div>
</section>

<Section id="enrollment-form-section"></Section>

<!-- <pre class="text-sm bg-muted p-4 rounded-lg">{JSON.stringify(data.enrollment, null, 2)}</pre> -->
