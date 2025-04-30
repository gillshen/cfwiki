<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import FormField from '$lib/components/ui/form/form-field.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	import Combobox from '$lib/components/forms/Combobox.svelte';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';

	import countryFlags, {
		isCityState,
		isDirectlyAdministered,
		orderMostAppliedFirst
	} from '$lib/constants/countries';

	import americanStates from '$lib/constants/americanStates';
	import canadianProvinces from '$lib/constants/canadianProvinces';
	import chineseProvinces from '$lib/constants/chineseProvinces';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;

	const form = superForm(data.schoolForm);
	const { form: formData, enhance } = form;

	const countryItems = Object.entries(countryFlags)
		.filter(([country]) => country !== 'United States Green Card')
		.map(([country, flag]) => ({ label: `${flag}\xa0\xa0${country}`, value: country }))
		.sort((a, b) => orderMostAppliedFirst(a.value, b.value));

	$: {
		if ($formData.country === 'China' && isDirectlyAdministered($formData.region)) {
			$formData.city = $formData.region;
		}
	}
</script>

<svelte:head>
	<title>{createTitle('Create School Profile')}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/school/index">Schools</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>New</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<h1 class="page-title mb-2">Create School Profile</h1>

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
				{ label: 'Other', value: 'Other' }
			]}
		/>

		<FormField {form} name="name" class="pb-1">
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

		<FormField {form} name="alt_name" class="pb-1">
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
				items={Object.keys(chineseProvinces)}
				isOptional
				onSelect={() => ($formData.city = '')}
			/>
		{:else if $formData.country === 'United States'}
			<Combobox
				{form}
				name="region"
				label="Region"
				items={Object.keys(americanStates)}
				isOptional
				onSelect={() => ($formData.city = '')}
			/>
		{:else if $formData.country === 'Canada'}
			<Combobox
				{form}
				name="region"
				label="Region"
				items={Object.keys(canadianProvinces)}
				isOptional
				onSelect={() => ($formData.city = '')}
			/>
		{/if}

		{#if $formData.country === 'China' && $formData.region}
			<Combobox
				{form}
				name="city"
				label="City"
				items={chineseProvinces[$formData.region]}
				isOptional
			/>
		{:else if $formData.country && ($formData.region || !isCityState($formData.country))}
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
