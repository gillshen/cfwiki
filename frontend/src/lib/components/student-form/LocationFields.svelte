<script lang="ts">
	import { Label, Input, Select, P } from 'flowbite-svelte';
	import countryFlags, { sortChinaUnitedStatesFirst } from '$lib/constants/countryFlags';
	import chineseProvinces from '$lib/constants/chineseProvinces';
	import canadianProvinces from '$lib/constants/canadianProvinces';
	import americanStates from '$lib/constants/americanStates';

	export let form: any;

	const countries = Object.keys(countryFlags).sort(sortChinaUnitedStatesFirst);
	const cityStates = ['Hong Kong', 'Macau', 'Monaco', 'Singapore', 'Vatican City'];
	const chineseMunicipalities = ['北京', '上海', '天津', '重庆'];

	const countriesWithDivisions = new Map();
	countriesWithDivisions.set('China', Object.keys(chineseProvinces));
	countriesWithDivisions.set('Canada', Object.keys(canadianProvinces));
	countriesWithDivisions.set('United States', Object.keys(americanStates));

	let subnationalLabel = $form.base_country === 'United States' ? 'State' : 'Province';

	const onCountryChange = () => {
		$form.base_subnational = '';
		$form.base_city = '';
		subnationalLabel = $form.base_country === 'United States' ? 'State' : 'Province';
	};

	const onSubnationalChange = () => {
		if (chineseMunicipalities.includes($form.base_subnational)) {
			$form.base_city = $form.base_subnational;
		} else {
			$form.base_city = '';
		}
	};
</script>

<P size="sm" class="font-medium">Where is the student from?</P>

<Label for="country" class="form-label">Country</Label>
<Select
	id="country"
	name="base_country"
	bind:value={$form.base_country}
	on:change={onCountryChange}
	required
>
	{#each countries as country}
		<option value={country}>{countryFlags[country]}&nbsp;&nbsp;{country}</option>
	{/each}
</Select>

{#if !!countriesWithDivisions.get($form.base_country)}
	<Label for="subnational" class="form-label optional">{subnationalLabel}</Label>
	<Select
		id="subnational"
		name="base_subnational"
		bind:value={$form.base_subnational}
		on:change={onSubnationalChange}
	>
		{#each countriesWithDivisions.get($form.base_country) as adminDivision}
			<option value={adminDivision}>{adminDivision}</option>
		{/each}
	</Select>
{/if}

<!-- Show the city field if the country is not one of Canada, China, and US,
 or if it is and a subnational division has been selected -->
{#if $form.base_country && ($form.base_subnational || !countriesWithDivisions.get($form.base_country))}
	{#if $form.base_country === 'China'}
		<!-- If the country is China, let the user select a city -->
		<Label for="city" class="form-label optional">City</Label>
		<Select id="city" name="base_city" bind:value={$form.base_city}>
			{#each chineseProvinces[$form.base_subnational] ?? [] as city}
				<option value={city}>{city}</option>
			{/each}
		</Select>
	{:else if !cityStates.includes($form.base_country)}
		<!-- Else if the country is not Hong Kong or Sinapore, let the user write in a city -->
		<Label for="city" class="form-label optional">City</Label>
		<Input type="text" id="city" name="base_city" maxlength="100" bind:value={$form.base_city} />
	{/if}
{/if}
