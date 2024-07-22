<script lang="ts">
	import { Label, Input, Select, P } from 'flowbite-svelte';
	import countryFlags from '$lib/constants/flags';
	import chineseProvinces from '$lib/constants/chineseProvinces';
	import canadianProvinces from '$lib/constants/canadianProvinces';
	import americanStates from '$lib/constants/americanStates';

	export let form: any;

	const countries = ['Canada', 'China', 'Hong Kong', 'Japan', 'Singapore', 'United States'];
	const cityStates = ['Hong Kong', 'Singapore'];
	const chineseMunicipalities = ['北京', '上海', '天津', '重庆'];

	const countriesWithDivisions = new Map();
	countriesWithDivisions.set('China', Object.keys(chineseProvinces));
	countriesWithDivisions.set('Canada', Object.keys(canadianProvinces));
	countriesWithDivisions.set('United States', Object.keys(americanStates));

	const onCountryChange = () => {
		$form.base_subnational = '';
		$form.base_city = '';
	};

	const onSubnationalChange = () => {
		if (chineseMunicipalities.includes($form.base_subnational)) {
			$form.base_city = $form.base_subnational;
		} else {
			$form.base_city = '';
		}
	};
</script>

<P size="base">Where is the student from?</P>

<div>
	<Label for="country" class="form-label optional">Country</Label>
	<Select
		id="country"
		name="base_country"
		bind:value={$form.base_country}
		on:change={onCountryChange}
	>
		{#each countries as country}
			<option value={country}>{countryFlags[country]}&nbsp;&nbsp;{country}</option>
		{/each}
	</Select>
</div>

<div>
	{#if !!countriesWithDivisions.get($form.base_country)}
		<Label for="subnational" class="form-label optional">Province/state</Label>
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
</div>

<div>
	{#if !!$form.base_subnational}
		{#if $form.base_country === 'China'}
			<Label for="city" class="form-label optional">City</Label>
			<Select id="city" name="base_city" bind:value={$form.base_city}>
				{#each chineseProvinces[$form.base_subnational] ?? [] as city}
					<option value={city}>{city}</option>
				{/each}
			</Select>
		{:else if !cityStates.includes($form.base_country)}
			<Label for="city" class="form-label optional">City</Label>
			<Input type="text" id="city" name="base_city" bind:value={$form.base_city} />
		{/if}
	{/if}
</div>
