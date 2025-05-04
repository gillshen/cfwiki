<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import { contractStatuses } from '$lib/api/contract';
	import { createTitle } from '$lib/util/siteUtils';

	import {
		allProgsWithContractTerms,
		secondaryProgsWithContractTerms,
		universityProgsWithContractTerms
	} from '$lib/constants/progressions';

	export let data;

	const contractForm = superForm(data.contractForm, { resetForm: false });
	const { enhance: contractFormEnhance } = contractForm;

	const contractDeleteFrom = superForm(data.contractDeleteForm, { id: 'contract-delete' });
	const { enhance: contractDeleteFormEnhance } = contractDeleteFrom;

	const title = `${data.student.fullname} \u2022 ${data.contract.type} ${data.contract.target_year}`;

	let progressions: string[];

	$: {
		if (data.contract.type === 'UG Freshman') {
			progressions = [...secondaryProgsWithContractTerms];
		} else if (data.contract.type === 'UG Transfer' || data.contract.type === 'Graduate') {
			progressions = [
				...secondaryProgsWithContractTerms.filter((p) => p.startsWith('G12')),
				...universityProgsWithContractTerms
			];
		} else {
			progressions = [...allProgsWithContractTerms];
		}
	}
</script>

<svelte:head>
	<title>{createTitle(title)}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Link href="/student/index">Students</Breadcrumb.Link>
	<Breadcrumb.Separator />
	<Breadcrumb.Link href="/student/{data.student.id}">{data.student.fullname}</Breadcrumb.Link>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>Contract: {data.contract.type} {data.contract.target_year}</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<h1 class="page-title flex gap-2 mb-2">
	<div>{data.student.fullname}</div>
	<div>&bullet;</div>
	<div>{data.contract.type} {data.contract.target_year}</div>
</h1>

<Section id="contract-form-section">
	<form
		method="POST"
		class="max-w-prose space-y-6 mt-4"
		action="?/updateContract"
		use:contractFormEnhance
		id="contract-form"
	>
		<input type="number" name="id" bind:value={data.contract.id} hidden />
		<input type="number" name="student" bind:value={data.student.id} hidden />
		<input name="type" bind:value={data.contract.type} hidden />
		<input type="number" name="target_year" bind:value={data.contract.target_year} hidden />

		<Combobox
			form={contractForm}
			name="status"
			label="Status"
			items={Array.from(contractStatuses)}
		/>
		<Input
			form={contractForm}
			name="date"
			label="Date signed"
			type="date"
			class="pb-0.5"
			optional
		/>
		<Combobox
			form={contractForm}
			name="student_progression_when_signed"
			label="Student progression"
			items={progressions}
			optional
		/>
		<Form.Button class="w-fit min-w-24">Submit</Form.Button>
	</form>

	<form
		method="POST"
		class="max-w-prose space-y-6 mt-4"
		action="?/deleteContract"
		use:contractDeleteFormEnhance
		id="contract-delete-form"
	>
		<input type="number" name="id" bind:value={data.contract.id} hidden />
		<Form.Button variant="destructive" class="w-fit min-w-24">Delete (instantly)</Form.Button>
	</form>
</Section>

<section class="pb-8">
	<pre class="text-sm p-4 rounded-lg bg-muted max-w-prose">{JSON.stringify(
			{ ...data.contract, services: 'see below' },
			null,
			2
		)}</pre>
</section>

<Section id="personnel" title="Personnel">
	{#each data.contract.services as service}
		<pre class="text-sm p-4 rounded-lg bg-muted max-w-prose">{JSON.stringify(
				service,
				null,
				2
			)}</pre>
	{/each}
</Section>
