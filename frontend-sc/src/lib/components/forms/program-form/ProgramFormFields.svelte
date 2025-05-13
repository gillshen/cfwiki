<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';

	import type { School } from '$lib/api/school';
	import type { Infer, SuperForm } from 'sveltekit-superforms';
	import type { NewProgramSchema } from '$lib/schemas/program';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import MultipleSelect from '$lib/components/forms/MultipleSelect.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import { PROGRAM_TYPES } from '$lib/api/program';
	import { lexicalChineseLast } from '$lib/util/stringUtils';

	export let schools: School[];
	export let form: SuperForm<Infer<NewProgramSchema>>;

	const { form: formData } = form;

	const handleProgramTypeSelection = () => {
		if ($formData.type !== "Master's" && $formData.type !== 'Doctorate') {
			$formData.degree = '';
		}
		if ($formData.type.startsWith('UG')) {
			$formData.name = '';
		}
	};
</script>

<MultipleSelect
	{form}
	name="schools"
	label="Host institution"
	width="w-[420px]"
	items={schools.map((s) => s.name).sort(lexicalChineseLast)}
	transformValue={(name) => schools.find((s) => s.name === name)?.id}
/>

<Combobox
	{form}
	name="type"
	label="Program type"
	items={[...PROGRAM_TYPES]}
	width="w-[240px]"
	postSelect={handleProgramTypeSelection}
/>

<!-- Prefer disabled input to hidden one to minimize height change in dialogs -->

<Input
	{form}
	name="degree"
	label="Degree awarded"
	inputClass="w-[420px]"
	description={'Use common abbreviations, such as \u201cMS\u201d, when appropriate.'}
	disabled={$formData.type !== "Master's" && $formData.type !== 'Doctorate'}
/>

<Input
	{form}
	name="name"
	label="Program name"
	inputClass="w-[420px]"
	description={$formData.type === 'Non-degree'
		? undefined
		: 'Do not include the degree. Instead of \u201cMS in Finance\u201d, simply \u201cFinance\u201d.'}
	disabled={!$formData.type || $formData.type.startsWith('UG')}
/>

<Form.Button class="w-fit min-w-24">Submit</Form.Button>
