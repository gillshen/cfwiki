<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import Section from '$lib/components/containers/Section.svelte';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import { createTitle } from '$lib/util/siteUtils';
	import { secondaryProgressions, universityProgressions } from '$lib/constants/progressions';

	export let data;

	const enrollmentForm = superForm(data.enrollmentForm, { resetForm: false });
	const { enhance: enrollmentFormEnhance } = enrollmentForm;

	let progressions: string[] = [];

	$: title = `${data.student.fullname} @ ${data.enrollment.school.name}`;

	$: {
		if (data.enrollment.program_type === 'Secondary School') {
			progressions = secondaryProgressions;
		} else if (data.enrollment.program_type === 'University') {
			progressions = universityProgressions;
		}
	}
</script>

<svelte:head>
	<title>{createTitle(title)}</title>
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

<h1 class="page-title mb-2">{title}</h1>

<Section id="enrollment-form-section">
	<form
		method="POST"
		class="max-w-prose space-y-6 mt-4"
		action="?/updateEnrollment"
		use:enrollmentFormEnhance
		id="enrollment-form"
	>
		<input type="number" name="id" bind:value={data.enrollment.id} hidden />

		<Input form={enrollmentForm} name="start_date" label="Start date" type="date" class="pb-0.5" />

		<Combobox
			form={enrollmentForm}
			name="start_progression"
			label="Entering as"
			items={progressions}
			optional
			searchDisabledEmptyText="You need to select a school type first"
			disableSearch
		/>

		<Input
			form={enrollmentForm}
			name="end_date"
			label="End date"
			type="date"
			class="pb-0.5"
			optional
		/>

		<Combobox
			form={enrollmentForm}
			name="end_progression"
			label="Leaving as"
			items={progressions}
			optional
			disableSearch
			searchDisabledEmptyText="You need to select a school type first"
		/>

		{#if data.enrollment.program_type === 'Secondary School'}
			<Combobox
				form={enrollmentForm}
				name="curriculum"
				label="Curriculum"
				items={['A-level', 'AP', 'IB', 'Other']}
				optional
				disableSearch
			/>
		{:else if data.enrollment.program_type === 'University'}
			<Input
				form={enrollmentForm}
				name="curriculum"
				label="Program or major"
				maxlength={50}
				optional
			/>
		{/if}

		<Form.Button class="w-fit min-w-24">Submit</Form.Button>
	</form>
</Section>

<pre class="text-sm bg-muted p-4 rounded-lg">{JSON.stringify(data.enrollment, null, 2)}</pre>
