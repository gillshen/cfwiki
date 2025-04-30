<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as Form from '$lib/components/ui/form/index';
	import FormField from '$lib/components/ui/form/form-field.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import RadioGroup from '$lib/components/forms/RadioGroup.svelte';

	import countryFlags, {
		isCityState,
		isDirectlyAdministered,
		orderChinaUnitedStatesFirst
	} from '$lib/constants/countries';

	import americanStates from '$lib/constants/americanStates';
	import canadianProvinces from '$lib/constants/canadianProvinces';
	import chineseProvinces from '$lib/constants/chineseProvinces';
	import { names } from '$lib/constants/fake';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;

	const form = superForm(data.studentForm);
	const { form: formData, enhance } = form;

	const fakeName = names[Math.floor(Math.random() * names.length)];

	const citizenshipItems = Object.entries(countryFlags)
		.map(([country, flag]) => ({ label: `${flag}\xa0\xa0${country}`, value: country }))
		.sort((a, b) => orderChinaUnitedStatesFirst(a.value, b.value));

	const countryItems = citizenshipItems.filter((item) => item.value !== 'United States Green Card');

	$: {
		if ($formData.base_country === 'China' && isDirectlyAdministered($formData.base_subnational)) {
			$formData.base_city = $formData.base_subnational;
		}
	}
</script>

<svelte:head>
	<title>{createTitle('Create Student Profile')}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/student/index">Students</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>New</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<h1 class="page-title mb-2">Create Student Profile</h1>

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

		<FormField {form} name="date_of_birth" class="pb-1">
			<Form.Control let:attrs>
				<Form.Label class="optional-field">Date of birth</Form.Label>
				<Input type="date" class="w-[360px]" {...attrs} bind:value={$formData.date_of_birth} />
			</Form.Control>
			<Form.FieldErrors />
		</FormField>

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
				items={Object.keys(chineseProvinces)}
				isOptional
				onSelect={() => ($formData.base_city = '')}
			/>
		{:else if $formData.base_country === 'United States'}
			<Combobox
				{form}
				name="base_subnational"
				label="Home state"
				items={Object.keys(americanStates)}
				isOptional
				onSelect={() => ($formData.base_city = '')}
			/>
		{:else if $formData.base_country === 'Canada'}
			<Combobox
				{form}
				name="base_subnational"
				label="Home province"
				items={Object.keys(canadianProvinces)}
				isOptional
				onSelect={() => ($formData.base_city = '')}
			/>
		{/if}

		{#if $formData.base_country === 'China' && $formData.base_subnational}
			<Combobox
				{form}
				name="base_city"
				label="Home city"
				items={chineseProvinces[$formData.base_subnational]}
				isOptional
			/>
		{:else if $formData.base_country && ($formData.base_subnational || !isCityState($formData.base_country))}
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
