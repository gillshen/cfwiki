<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import RadioGroup from '$lib/components/forms/RadioGroup.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import SchoolForm from '$lib/components/forms/SchoolForm.svelte';

	import { createTitle } from '$lib/util/siteUtils';
	import { orderByName } from '$lib/util/schoolUtils';
	import { universityProgressions, secondarySchoolProgressions } from '$lib/constants/progressions';

	export let data;

	const form = superForm(data.newEnrollmentForm);
	const { form: formData, enhance } = form;

	const schoolForm = superForm(data.newSchoolForm, {
		onUpdated({ form }) {
			// restore school type selection and set school selection
			$formData._school_type = form.data.type;
			$formData._school = form.data.name;
		}
	});
	const { form: schoolFormData, enhance: schoolFormEnhance } = schoolForm;

	let programTypeItems: string[];
	let progressions: string[];

	$: {
		if ($formData._school_type === 'Secondary School') {
			programTypeItems = ['Secondary School'];
			progressions = secondarySchoolProgressions;
			$formData.program_type = 'Secondary School';
			$schoolFormData.type = 'Secondary School';
		} else if ($formData._school_type === 'University') {
			programTypeItems = ['UG Freshman', 'UG Transfer', "Master's"];
			progressions = universityProgressions;
			if ($formData.program_type === 'Secondary School') {
				$formData.program_type = '';
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
			use:enhance
			id="enrollment-form"
		>
			<input type="number" name="student" bind:value={data.student.id} hidden />

			<RadioGroup
				{form}
				name="_school_type"
				label="School type"
				items={[
					{ label: 'University', value: 'University' },
					{ label: 'Secondary School', value: 'Secondary School' }
				]}
				onValueChange={() => {
					$formData._school = '';
					$formData.curriculum = '';
				}}
			/>

			<Combobox
				{form}
				name="_school"
				label="School"
				items={schools
					.filter((school) => school.type === $formData._school_type)
					.sort(orderByName)
					.map((school) => school.name)}
				width="w-[480px]"
				disableSearch={!$formData._school_type}
				searchDisabledEmptyText={$formData._school_type
					? undefined
					: 'You need to specify a school type first'}
				postSelect={() => {
					$formData.school = schools.find((school) => school.name === $formData._school)?.id ?? 0;
				}}
			>
				<div slot="if-not-found">
					{#if $formData._school_type}
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

			<input type="number" name="school" bind:value={$formData.school} hidden />

			<Combobox
				{form}
				name="program_type"
				label="Program type"
				items={programTypeItems}
				disableSearch
				searchDisabledEmptyText="You need to specify a school type first"
			/>

			<Input {form} name="start_date" label="Start date" type="date" class="pb-0.5" />

			<Combobox
				{form}
				name="start_progression"
				label="Entering as"
				items={progressions}
				optional
				searchDisabledEmptyText="You need to specify a school type first"
				disableSearch
			/>

			<Input {form} name="end_date" label="End date" type="date" class="pb-0.5" optional />

			<Combobox
				{form}
				name="end_progression"
				label="Leaving as"
				items={progressions}
				optional
				disableSearch
				searchDisabledEmptyText="You need to specify a school type first"
			/>

			{#if $formData._school_type === 'Secondary School'}
				<Combobox
					{form}
					name="curriculum"
					label="Curriculum"
					items={['A-level', 'AP', 'IB', 'Other']}
					optional
					disableSearch
				/>
			{:else if $formData._school_type === 'University'}
				<Input {form} name="curriculum" label="Program or major" maxlength={50} optional />
			{/if}

			<Form.Button class="w-fit min-w-24">Submit</Form.Button>
			<!-- <SuperDebug data={$enrollmentFormData} /> -->
		</form>
	</Section>
{/await}
