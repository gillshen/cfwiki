<script lang="ts">
	import { cn } from '$lib/utils';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';

	import type { NewProgramSchema } from '$lib/schemas/program';
	import type { School } from '$lib/api/school';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import NcCombobox from '$lib/components/interactive/Combobox.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import DismissibleBadge from '$lib/components/misc/DismissibleBadge.svelte';
	import { PROGRAM_TYPES } from '$lib/api/program';
	import { lexicalChineseLast } from '$lib/util/stringUtils';

	export let data: SuperValidated<Infer<NewProgramSchema>>;
	export let onUpdated: (event: { form: typeof data }) => any;
	export let action: string = '?/createProgram';
	export let schools: School[];
	export let className: string = '';
	export { className as class };

	const id = 'new-program-form';

	const form = superForm(data, { id, onUpdated });
	const { form: formData, enhance } = form;

	const handleSchoolSelection = () => {
		const selectedSchoolId = schools.find((s) => s.name === selectedSchoolName)?.id;

		if (selectedSchoolId) {
			$formData.schools = [...$formData.schools, selectedSchoolId];
		}
	};

	const handleSchoolRemoval = (schoolIdToRemove: number) => {
		$formData.schools = $formData.schools.filter((id) => id !== schoolIdToRemove);

		// it would be confusing if the school's name still appears in the combobox
		// when its badge has been dismissed: so check if it's the case and if it is,
		// clear the combobox
		const schoolNameToRemove = schools.find((s) => s.id === schoolIdToRemove)?.name;
		if (selectedSchoolName === schoolNameToRemove) {
			selectedSchoolName = '';
		}
	};

	let selectedSchoolName = '';
</script>

<form
	method="POST"
	{id}
	{action}
	use:enhance
	class={cn('max-w-prose flex flex-col gap-6 my-4 mx-auto', className)}
>
	<div class="flex flex-col gap-2">
		<Form.Field {form} name="schools">
			<Form.Control>
				<div class="flex flex-col gap-2">
					<Form.Label class="pb-0.5">Host institution</Form.Label>
					<NcCombobox
						bind:value={selectedSchoolName}
						items={schools.map((school) => school.name).sort(lexicalChineseLast)}
						onSelect={handleSchoolSelection}
						width="w-[420px]"
					/>
				</div>
				<select name="schools" multiple bind:value={$formData.schools} hidden>
					{#each schools as { id }}
						<option value={id}>{id}</option>
					{/each}
				</select>
				<Form.FieldErrors />
			</Form.Control>
		</Form.Field>
		{#if $formData.schools.length}
			<ul class="flex flex-col gap-2 mb-2">
				{#each $formData.schools as schoolId}
					{@const schoolName = schools.find((s) => s.id === schoolId)?.name}
					<DismissibleBadge onDismiss={() => handleSchoolRemoval(schoolId)} class="w-fit h-7"
						>{schoolName}</DismissibleBadge
					>
				{/each}
			</ul>
		{/if}
	</div>

	<Combobox {form} name="type" label="Program type" items={[...PROGRAM_TYPES]} width="w-[240px]" />

	{#if $formData.type === "Master's" || $formData.type === 'Doctorate'}
		<Input
			{form}
			name="degree"
			label="Degree awarded"
			inputClass="w-[420px]"
			description={'Use common abbreviations, such as \u201cMS\u201d, when appropriate.'}
		/>
	{/if}

	{#if $formData.type && !$formData.type.startsWith('UG')}
		<Input
			{form}
			name="name"
			label="Program name"
			inputClass="w-[420px]"
			description={$formData.type === 'Non-degree'
				? undefined
				: 'Do not include the degree. Instead of \u201cMS in Finance\u201d, simply \u201cFinance\u201d.'}
		/>
	{/if}

	<Form.Button class="w-fit min-w-24">Submit</Form.Button>
	<!-- <SuperDebug data={form.form} /> -->
</form>
