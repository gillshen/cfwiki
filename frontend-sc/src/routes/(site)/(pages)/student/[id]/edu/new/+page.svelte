<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import FormField from '$lib/components/ui/form/form-field.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import RadioGroup from '$lib/components/forms/RadioGroup.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import SchoolForm from '$lib/components/forms/SchoolForm.svelte';

	import { createTitle } from '$lib/util/siteUtils';
	import { orderByName } from '$lib/util/schoolUtils';
	import { universityProgressions, secondarySchoolProgressions } from '$lib/constants/progressions';

	export let data;

	const enrollmentForm = superForm(data.newEnrollmentForm);
	const { form: enrollmentFormData, enhance: enrollmentFormEnhance } = enrollmentForm;

	const schoolForm = superForm(data.newSchoolForm, {
		onUpdated({ form }) {
			// restore school type selection and set school selection
			$enrollmentFormData._school_type = form.data.type;
			$enrollmentFormData._school = form.data.name;
		}
	});
	const { form: schoolFormData, enhance: schoolFormEnhance } = schoolForm;

	let programTypeItems: string[];
	let progressions: string[];

	$: {
		if ($enrollmentFormData._school_type === 'Secondary School') {
			programTypeItems = ['Secondary School'];
			progressions = secondarySchoolProgressions;
			$enrollmentFormData.program_type = 'Secondary School';
			$schoolFormData.type = 'Secondary School';
		} else if ($enrollmentFormData._school_type === 'University') {
			programTypeItems = ['UG Freshman', 'UG Transfer', "Master's"];
			progressions = universityProgressions;
			if ($enrollmentFormData.program_type === 'Secondary School') {
				$enrollmentFormData.program_type = '';
			}
			$schoolFormData.type = 'University';
		} else {
			programTypeItems = [];
			progressions = [];
			$schoolFormData.type = '';
		}
	}

	let schoolFormOpen = false;
</script>

<svelte:head>
	<title>{createTitle(`${data.student.fullname} \u2022 Create Educational Experience`)}</title>
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
		<Breadcrumb.Page>New Educational Experience</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<h1 class="page-title mb-2">Create Educational Experience</h1>

{#await data.schools}
	<LoadingSign />
{:then schools}
	<Section id="enrollment-form-section">
		<form
			method="POST"
			action="?/createEnrollment"
			class="max-w-prose space-y-6 mt-4"
			use:enrollmentFormEnhance
			id="enrollment-form"
		>
			<input type="number" name="student" bind:value={data.student.id} hidden />

			<RadioGroup
				form={enrollmentForm}
				name="_school_type"
				label="School type"
				items={[
					{ label: 'University', value: 'University' },
					{ label: 'Secondary School', value: 'Secondary School' }
				]}
				onValueChange={() => {
					$enrollmentFormData._school = '';
					$enrollmentFormData.curriculum = '';
				}}
			/>

			<Combobox
				form={enrollmentForm}
				name="_school"
				label="School"
				items={schools
					.filter((school) => school.type === $enrollmentFormData._school_type)
					.sort(orderByName)
					.map((school) => school.name)}
				width="w-[480px]"
				disableSearch={!$enrollmentFormData._school_type}
				searchDisabledEmptyText={$enrollmentFormData._school_type
					? undefined
					: 'Have you specified a school type?'}
				postSelect={() => {
					$enrollmentFormData.school =
						schools.find((school) => school.name === $enrollmentFormData._school)?.id ?? 0;
				}}
			>
				<div slot="if-not-found">
					{#if $enrollmentFormData._school_type}
						<ButtonDialog
							buttonVariant="secondary"
							buttonText="Add School"
							buttonClass="mt-4 mx-auto"
							contentClass="min-w-[529px]"
							dialogTitle="Create School Profile"
							open={schoolFormOpen}
						>
							<form
								method="POST"
								action="?/createSchool"
								class="flex flex-col gap-4 items-start justify-start"
								use:schoolFormEnhance
								id="school-form"
							>
								<SchoolForm form={schoolForm} />
							</form>
							<!-- <SuperDebug data={$schoolFormData} /> -->
						</ButtonDialog>
					{/if}
				</div>
			</Combobox>

			<input type="number" name="school" bind:value={$enrollmentFormData.school} hidden />

			<Combobox
				form={enrollmentForm}
				name="program_type"
				label="Program type"
				items={programTypeItems}
				disableSearch
				searchDisabledEmptyText="Have you specified a school type?"
			/>

			<FormField form={enrollmentForm} name="start_date" class="pb-1">
				<Form.Control let:attrs>
					<Form.Label>Start date</Form.Label>
					<Input
						type="date"
						class="w-[360px]"
						{...attrs}
						bind:value={$enrollmentFormData.start_date}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</FormField>

			<Combobox
				form={enrollmentForm}
				name="start_progression"
				label="Entering as"
				items={progressions}
				isOptional
				disableSearch
			/>

			<FormField form={enrollmentForm} name="end_date" class="pb-1">
				<Form.Control let:attrs>
					<Form.Label class="optional-field">End date</Form.Label>
					<Input
						type="date"
						class="w-[360px]"
						{...attrs}
						bind:value={$enrollmentFormData.end_date}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</FormField>

			<Combobox
				form={enrollmentForm}
				name="end_progression"
				label="Leaving as"
				items={progressions}
				isOptional
				disableSearch
			/>

			{#if $enrollmentFormData._school_type === 'Secondary School'}
				<Combobox
					form={enrollmentForm}
					name="curriculum"
					label="Curriculum"
					items={['A-level', 'AP', 'IB', 'Other']}
					isOptional
					disableSearch
				/>
			{:else if $enrollmentFormData._school_type === 'University'}
				<FormField form={enrollmentForm} name="curriculum">
					<Form.Control let:attrs>
						<Form.Label class="optional-field">Program or major</Form.Label>
						<Input
							class="w-[360px]"
							maxlength={50}
							{...attrs}
							bind:value={$enrollmentFormData.curriculum}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</FormField>
			{/if}

			<Form.Button class="w-fit min-w-24">Submit</Form.Button>
			<!-- <SuperDebug data={$enrollmentFormData} /> -->
		</form>
	</Section>
{/await}
