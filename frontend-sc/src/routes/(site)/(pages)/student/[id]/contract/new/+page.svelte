<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import Input from '$lib/components/forms/Input.svelte';

	import { createTitle } from '$lib/util/siteUtils';
	import { activeYears } from '$lib/util/dateUtils';
	import { CONTRACT_TYPES, CONTRACT_STATUSES } from '$lib/api/contract';

	import {
		allProgsWithContractTerms,
		secondaryProgsWithContractTerms,
		universityProgsWithContractTerms
	} from '$lib/constants/progressions';

	export let data;

	const form = superForm(data.newContractForm);
	const { form: formData, enhance } = form;

	let progressions: string[];

	$: {
		if ($formData.type === 'UG Freshman') {
			progressions = [...secondaryProgsWithContractTerms];
		} else if ($formData.type === 'UG Transfer' || $formData.type === 'Graduate') {
			progressions = [
				...secondaryProgsWithContractTerms.filter((p) => p.startsWith('G12')),
				...universityProgsWithContractTerms
			];
		} else {
			progressions = [...allProgsWithContractTerms];
		}
		if (!progressions.includes($formData.student_progression_when_signed)) {
			$formData.student_progression_when_signed = '';
		}
	}
</script>

<svelte:head>
	<title>{createTitle(`${data.student.fullname} | Create Contract`)}</title>
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
		<Breadcrumb.Page>New Contract</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<h2 class="page-title mb-2">Create Contract</h2>

<Section id="contract-form-section">
	<form method="POST" action="?/createContract" class="max-w-prose space-y-6 mt-4" use:enhance>
		<input type="number" name="student" bind:value={data.student.id} hidden />

		<Combobox {form} name="type" label="Type" items={[...CONTRACT_TYPES]} />
		<Combobox {form} name="target_year" label="Target year" items={activeYears()} />
		<Combobox {form} name="status" label="Status" items={[...CONTRACT_STATUSES]} />
		<Input {form} name="date" label="Date signed" type="date" class="pb-0.5" optional />
		<Combobox
			{form}
			name="student_progression_when_signed"
			label="Student progression"
			items={progressions}
			optional
		/>
		<Form.Button class="w-fit min-w-24">Submit</Form.Button>
		<!-- <SuperDebug data={form.form} /> -->
	</form>
</Section>
