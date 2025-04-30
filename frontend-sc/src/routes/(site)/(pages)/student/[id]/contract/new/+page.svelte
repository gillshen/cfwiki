<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import FormField from '$lib/components/ui/form/form-field.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';

	import { activeYears } from '$lib/util/dateUtils';
	import { contractStatuses, contractTypes } from '$lib/api/contract';
	import { allProgressionsT } from '$lib/constants/progressions';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;

	const form = superForm(data.newContractForm);
	const { form: formData, enhance } = form;
</script>

<svelte:head>
	<title>{createTitle(`${data.student.fullname} \u2022 Create Contract`)}</title>
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

<h1 class="page-title mb-2">Create Contract</h1>

<Section id="contract-form-section">
	<form method="POST" action="?/createContract" class="max-w-prose space-y-6 mt-4" use:enhance>
		<input type="number" name="student" bind:value={data.student.id} hidden />

		<Combobox {form} name="type" label="Type" items={Array.from(contractTypes)} />
		<Combobox {form} name="target_year" label="Target year" items={activeYears()} />
		<Combobox {form} name="status" label="Status" items={Array.from(contractStatuses)} />

		<FormField {form} name="date" class="pb-1">
			<Form.Control let:attrs>
				<Form.Label class="optional-field">Date signed</Form.Label>
				<Input type="date" class="w-[360px]" {...attrs} bind:value={$formData.date} />
			</Form.Control>
			<Form.FieldErrors />
		</FormField>

		<Combobox
			{form}
			name="student_progression_when_signed"
			label="Student progression"
			items={allProgressionsT}
			isOptional
		/>

		<Form.Button class="w-fit min-w-24">Submit</Form.Button>
		<!-- <SuperDebug data={$formData} /> -->
	</form>
</Section>
