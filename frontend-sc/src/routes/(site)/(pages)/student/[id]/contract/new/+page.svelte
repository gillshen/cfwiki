<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import * as StudentPage from '$lib/components/widgets/student-page/index';
	import RadioGroup from '$lib/components/forms/RadioGroup.svelte';
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

<StudentPage.Layout>
	<svelte:fragment slot="breadcrumb">
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/student/{data.student.id}">{data.student.fullname}</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page>New Contract</Breadcrumb.Page>
		</Breadcrumb.Item>
	</svelte:fragment>

	<StudentPage.Header student={data.student} slot="header" />

	<h3 class="pb-2 pt-[72px] px-6 text-sm text-muted-foreground">Create Contract</h3>

	<section class="border rounded-xl px-12 py-4 bg-white max-w-prose w-fit">
		<form
			method="POST"
			action="?/createContract"
			class="w-[450px] max-w-prose space-y-6 my-4"
			use:enhance
		>
			<input type="number" name="student" bind:value={data.student.id} hidden />

			<Combobox {form} name="type" label="Type" items={[...CONTRACT_TYPES]} />
			<Combobox {form} name="target_year" label="Target year" items={activeYears()} />
			<RadioGroup {form} name="status" label="Status" items={[...CONTRACT_STATUSES]} />
			<Input {form} name="date" label="Effective date" type="date" class="pb-0.5" optional />
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
	</section>
</StudentPage.Layout>
