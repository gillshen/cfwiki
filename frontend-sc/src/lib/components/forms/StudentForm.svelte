<script lang="ts">
	import type { SuperForm, Infer } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	import type { StudentSchema } from '$lib/schemas/student';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import Textarea from '$lib/components/forms/Textarea.svelte';
	import RadioGroup from '$lib/components/forms/RadioGroup.svelte';
	import americanStates from '$lib/constants/americanStates';
	import canadianProvinces from '$lib/constants/canadianProvinces';
	import chineseProvinces from '$lib/constants/chineseProvinces';
	import { names } from '$lib/constants/fake';

	import countryFlags, {
		isCityState,
		isDirectlyAdministered,
		orderChinaUnitedStatesFirst
	} from '$lib/constants/countries';

	export let form: SuperForm<Infer<StudentSchema>>;

	const { form: formData } = form;

	const fakeName = names[Math.floor(Math.random() * names.length)];

	const citizenshipItems = Object.entries(countryFlags)
		.map(([country, flag]) => ({ label: `${flag}\xa0\xa0${country}`, value: country }))
		.sort((a, b) => orderChinaUnitedStatesFirst(a.value, b.value));

	const countryItems = citizenshipItems.filter((item) => item.value !== 'United States Green Card');

	const regionMap: Record<string, { label: string; regions: string[] }> = {
		China: { label: 'province', regions: Object.keys(chineseProvinces) },
		'United States': { label: 'state', regions: Object.keys(americanStates) },
		Canada: { label: 'province', regions: Object.keys(canadianProvinces) }
	};

	$: regionRequired = ['China', 'United States', 'Canada'].includes($formData.base_country);

	$: showCityInput =
		$formData.base_country &&
		($formData.base_subnational || (!regionRequired && !isCityState($formData.base_country)));

	$: {
		if ($formData.base_country === 'China' && isDirectlyAdministered($formData.base_subnational)) {
			$formData.base_city = $formData.base_subnational;
		}
	}
</script>

<input type="number" name="id" bind:value={$formData.id} hidden />

<Input
	{form}
	name="surname"
	label="Last name"
	placeholder={fakeName.surname ?? ''}
	maxlength={100}
/>

<Input
	{form}
	name="given_name"
	label="First name"
	placeholder={fakeName.givenName ?? ''}
	maxlength={100}
/>

<Form.Field {form} name="surname_first" class="flex flex-row items-start space-x-3 space-y-0">
	<Form.Control let:attrs>
		<Checkbox {...attrs} bind:checked={$formData.surname_first} />
		<div class="space-y-1 leading-none">
			<Form.Label>Last name first</Form.Label>
			<Form.Description class="text-xs"
				>Display the full name as &ldquo;{$formData.surname_first
					? `${$formData.surname || fakeName.surname}${$formData.given_name || fakeName.givenName}`
					: `${$formData.given_name || fakeName.givenName} ${$formData.surname || fakeName.surname}`}&rdquo;</Form.Description
			>
		</div>
		<input name={attrs.name} value={$formData.surname_first} hidden />
	</Form.Control>
</Form.Field>

<Input {form} name="preferred_name" label="Preferred name" maxlength={50} class="pb-0.5" optional />

<RadioGroup
	{form}
	name="gender"
	label="Gender"
	items={[
		{ label: 'Female', value: 'female' },
		{ label: 'Male', value: 'male' },
		{ label: 'Other', value: 'other' }
	]}
/>

<Combobox {form} name="citizenship" label="Citizenship" items={citizenshipItems} />

<Input {form} name="date_of_birth" label="Date of birth" type="date" class="pb-0.5" optional />

<Combobox
	{form}
	name="base_country"
	label="Country of primary residence"
	items={countryItems}
	onSelect={() => {
		$formData.base_subnational = '';
		$formData.base_city = '';
	}}
/>

{#key $formData.base_country}
	{#if regionRequired}
		<Combobox
			{form}
			name="base_subnational"
			label="Home {regionMap[$formData.base_country].label}"
			items={regionMap[$formData.base_country].regions}
			optional
			onSelect={() => ($formData.base_city = '')}
		/>
	{/if}
{/key}

{#if $formData.base_country === 'China' && $formData.base_subnational}
	<Combobox
		{form}
		name="base_city"
		label="Home city"
		items={chineseProvinces[$formData.base_subnational]}
		optional
	/>
{:else if showCityInput}
	<Input {form} name="base_city" label="Home city" maxlength={100} optional />
{/if}

<Textarea
	{form}
	name="comments"
	label="Comments"
	maxlength={5000}
	textareaClass="w-[450px]"
	description="Anything you want to note about the student"
	optional
/>
