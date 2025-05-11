<script lang="ts">
	import type { SuperForm, Infer } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';

	import type { SchoolSchema } from '$lib/schemas/school';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import Input from '$lib/components/forms/Input.svelte';
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

<Input
	{form}
	name="name"
	label="Full name"
	placeholder="Clayton University"
	maxlength={100}
	class="text-left pb-0.5"
/>

<Input
	{form}
	name="alt_name"
	label="Abbreviation"
	placeholder="Clayton"
	maxlength={20}
	optional
	class="text-left pb-0.5"
/>

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
			optional
			onSelect={() => ($formData.city = '')}
		/>
	{/if}
{/key}

{#if $formData.country === 'China' && $formData.region}
	<Combobox {form} name="city" label="City" items={chineseProvinces[$formData.region]} optional />
{:else if showCityInput}
	<Input {form} name="city" label="City" maxlength={100} optional class="text-left" />
{/if}

<Form.Button class="w-fit min-w-24">Submit</Form.Button>
