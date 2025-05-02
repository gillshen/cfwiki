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

	import { createTitle } from '$lib/util/siteUtils';
	import { orderByName } from '$lib/util/schoolUtils.js';
	import { universityProgressions, secondarySchoolProgressions } from '$lib/constants/progressions';

	export let data;

	const form = superForm(data.newEnrollmentForm);
	const { form: formData, enhance } = form;

	let programTypeItems: string[];
	let progressions: string[];

	$: {
		if ($formData._school_type === 'Secondary School') {
			programTypeItems = ['Secondary School'];
			progressions = secondarySchoolProgressions;
			$formData.program_type = 'Secondary School';
		} else if ($formData._school_type === 'University') {
			programTypeItems = ['UG Freshman', 'UG Transfer', "Master's"];
			progressions = universityProgressions;
		} else {
			programTypeItems = [];
			progressions = [];
		}
	}
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
		<form method="POST" action="?/createEnrollment" class="max-w-prose space-y-6 mt-4" use:enhance>
			<input type="number" name="student" bind:value={data.student.id} hidden />

			<RadioGroup
				{form}
				name="_school_type"
				label="School type"
				items={[
					{ label: 'University', value: 'University' },
					{ label: 'Secondary School', value: 'Secondary School' }
				]}
				onValueChange={() => ($formData.curriculum = '')}
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
				postSelect={() => {
					$formData.school = schools.find((school) => school.name === $formData._school)?.id ?? 0;
				}}
			/>

			<input type="number" name="school" bind:value={$formData.school} hidden />

			<Combobox
				{form}
				name="program_type"
				label="Program type"
				items={programTypeItems}
				disableSearch
			/>

			<FormField {form} name="start_date" class="pb-1">
				<Form.Control let:attrs>
					<Form.Label>Start date</Form.Label>
					<Input type="date" class="w-[360px]" {...attrs} bind:value={$formData.start_date} />
				</Form.Control>
				<Form.FieldErrors />
			</FormField>

			<Combobox
				{form}
				name="start_progression"
				label="Entering as"
				items={progressions}
				isOptional
				disableSearch
			/>

			<FormField {form} name="end_date" class="pb-1">
				<Form.Control let:attrs>
					<Form.Label class="optional-field">End date</Form.Label>
					<Input type="date" class="w-[360px]" {...attrs} bind:value={$formData.end_date} />
				</Form.Control>
				<Form.FieldErrors />
			</FormField>

			<Combobox
				{form}
				name="end_progression"
				label="Leaving as"
				items={progressions}
				isOptional
				disableSearch
			/>

			{#if $formData._school_type === 'Secondary School'}
				<Combobox
					{form}
					name="curriculum"
					label="Curriculum"
					items={['A-level', 'AP', 'IB', 'Other']}
					isOptional
					disableSearch
				/>
			{:else if $formData._school_type === 'University'}
				<FormField {form} name="curriculum">
					<Form.Control let:attrs>
						<Form.Label class="optional-field">Program or major</Form.Label>
						<Input class="w-[360px]" maxlength={50} {...attrs} bind:value={$formData.curriculum} />
					</Form.Control>
					<Form.FieldErrors />
				</FormField>
			{/if}

			<Form.Button class="w-fit min-w-24">Submit</Form.Button>
			<!-- <SuperDebug data={$formData} /> -->
		</form>
	</Section>
{/await}
