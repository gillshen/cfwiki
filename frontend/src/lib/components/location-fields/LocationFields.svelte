<script lang="ts">
	import { Label, Input, Select, P } from 'flowbite-svelte';
	import countryFlags, { orderChinaUnitedStatesFirst } from '$lib/constants/countryFlags';
	import chineseProvinces from '$lib/constants/chineseProvinces';
	import canadianProvinces from '$lib/constants/canadianProvinces';
	import americanStates from '$lib/constants/americanStates';

	export let form: any;
	export let countryFieldName: string = 'country';
	export let regionFieldName: string = 'region';
	export let cityFieldName: string = 'city';

	const countries = Object.keys(countryFlags)
		.filter((c) => c !== 'United States Green Card')
		.sort(orderChinaUnitedStatesFirst);

	const cityStates = ['Hong Kong', 'Macau', 'Monaco', 'Singapore', 'Vatican City'];
	const chineseMunicipalities = ['北京', '上海', '天津', '重庆'];

	const countriesWithDivisions = new Map();
	countriesWithDivisions.set('China', Object.keys(chineseProvinces));
	countriesWithDivisions.set('Canada', Object.keys(canadianProvinces));
	countriesWithDivisions.set('United States', Object.keys(americanStates));

	let subnationalLabel = $form[countryFieldName] === 'United States' ? 'State' : 'Province';

	const onCountryChange = () => {
		$form[regionFieldName] = '';
		$form[cityFieldName] = '';
		subnationalLabel = $form[countryFieldName] === 'United States' ? 'State' : 'Province';
	};

	const onSubnationalChange = () => {
		if (chineseMunicipalities.includes($form[regionFieldName])) {
			$form[cityFieldName] = $form[regionFieldName];
		} else {
			$form[cityFieldName] = '';
		}
	};
</script>

<Label for="country" class="form-label">Country</Label>
<Select
	id="country"
	name={countryFieldName}
	bind:value={$form[countryFieldName]}
	on:change={onCountryChange}
	required
>
	{#each countries as country}
		<option value={country}>{countryFlags[country]}&nbsp;&nbsp;{country}</option>
	{/each}
</Select>

{#if !!countriesWithDivisions.get($form[countryFieldName])}
	<Label for="subnational" class="form-label optional">{subnationalLabel}</Label>
	<Select
		id="subnational"
		name={regionFieldName}
		bind:value={$form[regionFieldName]}
		on:change={onSubnationalChange}
	>
		{#each countriesWithDivisions.get($form[countryFieldName]) as adminDivision}
			<option value={adminDivision}>{adminDivision}</option>
		{/each}
	</Select>
{/if}

<!-- Show the city field if the country is not one of Canada, China, and US,
 or if it is and a subnational division has been selected -->
{#if $form[countryFieldName] && ($form[regionFieldName] || !countriesWithDivisions.get($form[countryFieldName]))}
	{#if $form[countryFieldName] === 'China'}
		<!-- If the country is China, let the user select a city -->
		<Label for="city" class="form-label optional">City</Label>
		<Select id="city" name={cityFieldName} bind:value={$form[cityFieldName]}>
			{#each chineseProvinces[$form[regionFieldName]] ?? [] as city}
				<option value={city}>{city}</option>
			{/each}
		</Select>
	{:else if !cityStates.includes($form[countryFieldName])}
		<!-- Else if the country is not Hong Kong or Sinapore, let the user write in a city -->
		<Label for="city" class="form-label optional">City</Label>
		<Input
			type="text"
			id="city"
			name={cityFieldName}
			maxlength="100"
			bind:value={$form[cityFieldName]}
		/>
	{/if}
{/if}
