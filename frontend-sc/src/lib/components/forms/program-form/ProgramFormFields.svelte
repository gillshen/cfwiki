<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	import { PROGRAM_TYPES, type ProgramDetail } from '$lib/api/program';
	import type { School } from '$lib/api/school';
	import type { Infer, SuperForm } from 'sveltekit-superforms';
	import type { ProgramSchema } from '$lib/schemas/program';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import MultipleSelect from '$lib/components/forms/MultipleSelect.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import { lexicalChineseLast } from '$lib/util/stringUtils';

	export let form: SuperForm<Infer<ProgramSchema>>;
	export let program: ProgramDetail | undefined = undefined;
	export let schools: School[] = [];

	const { form: formData } = form;

	const handleProgramTypeSelection = () => {
		if ($formData.type !== "Master's" && $formData.type !== 'Doctorate') {
			$formData.degree = '';
		}
		if ($formData.type.startsWith('UG')) {
			$formData.name = '';
		}
	};

	// if given a program instance, populate the form with its properties
	const schoolIds = program?.schools.map((s) => s.id) ?? [];
	if (program) {
		$formData = { ...$formData, ...program, schools: schoolIds };
	}
</script>

{#if program}
	<input type="number" name="id" value={program.id} hidden />
	<select multiple name="schools" value={schoolIds} hidden>
		{#each schoolIds as schoolId}
			<option value={schoolId}>{schoolId}</option>
		{/each}
	</select>
	<input name="type" value={program.type} hidden />
{:else}
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
{/if}

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

<Form.Field {form} name="is_defunct" class="flex flex-row items-start space-x-3 space-y-0">
	<Form.Control let:attrs>
		<Checkbox {...attrs} bind:checked={$formData.is_defunct} />
		<div class="space-y-1 leading-none">
			<Form.Label>This program is defunct</Form.Label>
		</div>
		<input name={attrs.name} value={$formData.is_defunct} hidden />
	</Form.Control>
</Form.Field>

<Form.Button class="w-fit min-w-24">Submit</Form.Button>
