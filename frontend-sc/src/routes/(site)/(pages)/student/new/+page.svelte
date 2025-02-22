<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import FormField from '$lib/components/ui/form/form-field.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	import Section from '$lib/components/containers/Section.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import RadioGroup from '$lib/components/forms/RadioGroup.svelte';

	import countryFlags, { orderChinaUnitedStatesFirst } from '$lib/constants/countries';
	import americanStates from '$lib/constants/americanStates';
	import canadianProvinces from '$lib/constants/canadianProvinces';
	import chineseProvinces from '$lib/constants/chineseProvinces';
	import { names } from '$lib/constants/fake';

	export let data;

	const form = superForm(data.studentForm);
	const { form: formData, enhance } = form;

	const fakeName = names[Math.floor(Math.random() * names.length)];

	const citizenshipItems = Object.entries(countryFlags)
		.map(([country, flag]) => ({ label: `${flag}\xa0\xa0${country}`, value: country }))
		.sort((a, b) => orderChinaUnitedStatesFirst(a.value, b.value));

	const countryItems = citizenshipItems.filter((item) => item.value !== 'United States Green Card');

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
			$formData.base_country === 'China' &&
			['北京', '上海', '天津', '重庆'].includes($formData.base_subnational)
		) {
			$formData.base_city = $formData.base_subnational;
		}
	}
</script>

<h1 class="page-title mb-2">Student Profile</h1>

<Section id="student-form-section">
	<form
		method="POST"
		class="max-w-prose space-y-6 mt-4"
		action="?/createStudent"
		use:enhance
		id="student-form"
	>
		<FormField {form} name="surname">
			<Form.Control let:attrs>
				<Form.Label>Surname</Form.Label>
				<Input
					placeholder={fakeName.surname ?? ''}
					class="w-[360px]"
					maxlength={100}
					{...attrs}
					bind:value={$formData.surname}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</FormField>

		<FormField {form} name="given_name">
			<Form.Control let:attrs>
				<Form.Label>Given name</Form.Label>
				<Input
					placeholder={fakeName.givenName ?? ''}
					class="w-[360px]"
					maxlength={100}
					{...attrs}
					bind:value={$formData.given_name}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</FormField>

		<Form.Field {form} name="surname_first" class="flex flex-row items-start space-x-3 space-y-0">
			<Form.Control let:attrs>
				<Checkbox {...attrs} bind:checked={$formData.surname_first} />
				<div class="space-y-1 leading-none">
					<Form.Label>Surname first</Form.Label>
					<Form.Description
						>Place the surname before the given name, as in a typical Chinese name.</Form.Description
					>
				</div>
				<input name={attrs.name} value={$formData.surname_first} hidden />
			</Form.Control>
		</Form.Field>

		<FormField {form} name="preferred_name">
			<Form.Control let:attrs>
				<Form.Label class="optional-field">Preferred name</Form.Label>
				<Input class="w-[360px]" maxlength={50} {...attrs} bind:value={$formData.preferred_name} />
			</Form.Control>
			<Form.FieldErrors />
		</FormField>

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

		<FormField {form} name="date_of_birth">
			<Form.Control let:attrs>
				<Form.Label class="optional-field">Date of birth</Form.Label>
				<Input type="date" class="w-[360px]" {...attrs} bind:value={$formData.date_of_birth} />
			</Form.Control>
			<Form.FieldErrors />
		</FormField>

		<Separator />

		<Combobox
			{form}
			name="base_country"
			label="Home country"
			items={countryItems}
			description="Country of primary residence"
			onSelect={() => {
				$formData.base_subnational = '';
				$formData.base_city = '';
			}}
		/>

		{#if $formData.base_country === 'China'}
			<Combobox
				{form}
				name="base_subnational"
				label="Home province"
				items={chineseProvinceItems}
				isOptional
				onSelect={() => ($formData.base_city = '')}
			/>
		{:else if $formData.base_country === 'United States'}
			<Combobox
				{form}
				name="base_subnational"
				label="Home state"
				items={americanStateItems}
				isOptional
				onSelect={() => ($formData.base_city = '')}
			/>
		{:else if $formData.base_country === 'Canada'}
			<Combobox
				{form}
				name="base_subnational"
				label="Home province"
				items={canadianProvinceItems}
				isOptional
				onSelect={() => ($formData.base_city = '')}
			/>
		{/if}

		{#if $formData.base_country === 'China' && $formData.base_subnational}
			<Combobox
				{form}
				name="base_city"
				label="Home city"
				items={chineseProvinces[$formData.base_subnational].map((city) => ({
					label: city,
					value: city
				}))}
				isOptional
			/>
		{:else if $formData.base_country && ($formData.base_subnational || !bigThreeOrCityStates.includes($formData.base_country))}
			<FormField {form} name="base_city">
				<Form.Control let:attrs>
					<Form.Label class="optional-field">Home city</Form.Label>
					<Input class="w-[360px]" {...attrs} bind:value={$formData.base_city} />
				</Form.Control>
				<Form.FieldErrors />
			</FormField>
		{/if}

		<Form.Field {form} name="comments">
			<Form.Control let:attrs>
				<Form.Label class="optional-field">Comments</Form.Label>
				<Textarea rows={4} maxlength={5000} {...attrs} bind:value={$formData.comments} />
			</Form.Control>
			<Form.Description>Anything you want to note about the student</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Button class="w-fit min-w-24">Submit</Form.Button>
	</form>
</Section>

<div class="mt-12 max-w-prose">
	<SuperDebug data={$formData} />
</div>
