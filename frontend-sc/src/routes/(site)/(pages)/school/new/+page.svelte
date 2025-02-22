<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import FormField from '$lib/components/ui/form/form-field.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';

	import Section from '$lib/components/containers/Section.svelte';
	import countryFlags, { orderMostAppliedFirst } from '$lib/constants/countries';
	import americanStates from '$lib/constants/americanStates';
	import canadianProvinces from '$lib/constants/canadianProvinces';
	import chineseProvinces from '$lib/constants/chineseProvinces';

	export let data;

	const form = superForm(data.schoolForm);
	const { form: formData, enhance } = form;

	const countryItems = Object.entries(countryFlags)
		.filter(([country, flag]) => country !== 'United States Green Card')
		.map(([country, flag]) => ({ label: `${flag}\xa0\xa0${country}`, value: country }))
		.sort((a, b) => orderMostAppliedFirst(a.value, b.value));

	const americanStateItems = Object.keys(americanStates).map((key) => ({ label: key, value: key }));

	const chineseProvinceItems = Object.keys(chineseProvinces).map((key) => ({
		label: key,
		value: key
	}));

	const canadianProvinceItems = Object.keys(canadianProvinces).map((key) => ({
		label: key,
		value: key
	}));

	const bigThreeOrCityStates = [
		'China',
		'United States',
		'Canada',
		'Hong Kong',
		'Macau',
		'Monaco',
		'Singapore',
		'Vatican City'
	];

	$: {
		if (
			$formData.country === 'China' &&
			['北京', '上海', '天津', '重庆'].includes($formData.region)
		) {
			$formData.city = $formData.region;
		}
	}
</script>

<h1 class="page-title mb-2">School Profile</h1>

<Section id="school-form-section">
	<form
		method="POST"
		class="max-w-prose space-y-6 mt-4"
		action="?/createSchool"
		use:enhance
		id="school-form"
	>
		<Combobox
			{form}
			name="type"
			label="Type"
			items={[
				{ label: 'University', value: 'University' },
				{ label: 'Secondary School', value: 'Secondary School' },
				{ label: 'Other', value: 'other' }
			]}
		/>

		<FormField {form} name="name">
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

		<FormField {form} name="alt_name">
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

		{#if $formData.country === 'China'}
			<Combobox
				{form}
				name="region"
				label="Region"
				items={chineseProvinceItems}
				isOptional
				onSelect={() => ($formData.city = '')}
			/>
		{:else if $formData.country === 'United States'}
			<Combobox
				{form}
				name="region"
				label="Region"
				items={americanStateItems}
				isOptional
				onSelect={() => ($formData.city = '')}
			/>
		{:else if $formData.country === 'Canada'}
			<Combobox
				{form}
				name="region"
				label="Region"
				items={canadianProvinceItems}
				isOptional
				onSelect={() => ($formData.city = '')}
			/>
		{/if}

		{#if $formData.country === 'China' && $formData.region}
			<Combobox
				{form}
				name="city"
				label="City"
				items={chineseProvinces[$formData.region].map((city) => ({
					label: city,
					value: city
				}))}
				isOptional
			/>
		{:else if $formData.country && ($formData.region || !bigThreeOrCityStates.includes($formData.country))}
			<FormField {form} name="city">
				<Form.Control let:attrs>
					<Form.Label class="optional-field">City</Form.Label>
					<Input class="w-[360px]" {...attrs} bind:value={$formData.city} />
				</Form.Control>
				<Form.FieldErrors />
			</FormField>
		{/if}

		<Form.Button class="w-fit min-w-24">Submit</Form.Button>
	</form>
</Section>

<div class="mt-12 max-w-prose">
	<SuperDebug data={$formData} />
</div>
