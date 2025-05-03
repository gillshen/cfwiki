<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import FormField from '$lib/components/ui/form/form-field.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	import type { SuperForm, Infer } from 'sveltekit-superforms';
	import type { SchoolSchema } from '$lib/schemas/school';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import americanStates from '$lib/constants/americanStates';
	import canadianProvinces from '$lib/constants/canadianProvinces';
	import chineseProvinces from '$lib/constants/chineseProvinces';

	import countryFlags, {
		isCityState,
		isDirectlyAdministered,
		orderMostAppliedFirst
	} from '$lib/constants/countries';

	export let form: SuperForm<Infer<SchoolSchema>>;
	export let hideSchoolType: boolean = false;

	const { form: formData } = form;

	const countryItems = Object.entries(countryFlags)
		.filter(([country]) => country !== 'United States Green Card')
		.map(([country, flag]) => ({ label: `${flag}\xa0\xa0${country}`, value: country }))
		.sort((a, b) => orderMostAppliedFirst(a.value, b.value));

	const regionMap: Record<string, string[]> = {
		China: Object.keys(chineseProvinces),
		'United States': Object.keys(americanStates),
		Canada: Object.keys(canadianProvinces)
	};

	$: regionRequired = ['China', 'United States', 'Canada'].includes($formData.country);

	$: showCityInput =
		$formData.country && ($formData.region || (!regionRequired && !isCityState($formData.country)));

	$: {
		if ($formData.country === 'China' && isDirectlyAdministered($formData.region)) {
			$formData.city = $formData.region;
		}
	}
</script>

<input type="number" name="id" bind:value={$formData.id} hidden />

{#if hideSchoolType}
	<input type="text" name="type" bind:value={$formData.type} hidden />
{:else}
	<Combobox {form} name="type" label="Type" items={['University', 'Secondary School', 'Other']} />
{/if}

<FormField {form} name="name" class="pb-1 text-left">
	<Form.Control let:attrs>
		<Form.Label>Full name</Form.Label>
		<Input
			placeholder="Clayton University"
			class="w-[480px]"
			maxlength={100}
			{...attrs}
			bind:value={$formData.name}
		/>
	</Form.Control>
	<Form.FieldErrors />
</FormField>

<FormField {form} name="alt_name" class="pb-1 text-left">
	<Form.Control let:attrs>
		<Form.Label class="optional-field">Abbreviation</Form.Label>
		<Input
			placeholder="Clayton"
			class="w-[360px]"
			maxlength={20}
			{...attrs}
			bind:value={$formData.alt_name}
		/>
	</Form.Control>
	<Form.FieldErrors />
</FormField>

<Combobox
	{form}
	name="country"
	label="Country"
	items={countryItems}
	onSelect={() => {
		$formData.region = '';
		$formData.city = '';
	}}
/>

{#key $formData.country}
	{#if regionRequired}
		<Combobox
			{form}
			name="region"
			label="Region"
			items={regionMap[$formData.country]}
			isOptional
			onSelect={() => ($formData.city = '')}
		/>
	{/if}
{/key}

{#if $formData.country === 'China' && $formData.region}
	<Combobox {form} name="city" label="City" items={chineseProvinces[$formData.region]} isOptional />
{:else if showCityInput}
	<FormField {form} name="city" class="text-left">
		<Form.Control let:attrs>
			<Form.Label class="optional-field">City</Form.Label>
			<Input class="w-[360px]" {...attrs} bind:value={$formData.city} />
		</Form.Control>
		<Form.FieldErrors />
	</FormField>
{/if}

<Form.Button class="w-fit min-w-24">Submit</Form.Button>
