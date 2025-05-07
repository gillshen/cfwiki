<script lang="ts">
	import type { SuperForm, Infer } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import type { CommonEnrollmentSchema } from '$lib/schemas/enrollment';

	export let form: SuperForm<Infer<CommonEnrollmentSchema>>;
	export let programType: 'Secondary School' | string;
	export let progressions: string[];
</script>

<Input {form} name="start_date" label="Start date" type="date" class="pb-0.5" />

<Combobox
	{form}
	name="start_progression"
	label="Entering as"
	items={progressions}
	optional
	searchDisabledEmptyText="You need to select a school type first"
	disableSearch
/>

<Input {form} name="end_date" label="End date" type="date" class="pb-0.5" optional />

<Combobox
	{form}
	name="end_progression"
	label="Leaving as"
	items={progressions}
	optional
	disableSearch
	searchDisabledEmptyText="You need to select a school type first"
/>

{#if programType === 'Secondary School'}
	<Combobox
		{form}
		name="curriculum"
		label="Curriculum"
		items={['A-level', 'AP', 'IB', 'Other']}
		optional
		disableSearch
	/>
{:else if programType}
	<Input {form} name="curriculum" label="Program or major" maxlength={50} optional />
{/if}

<Form.Button class="w-fit min-w-24">Submit</Form.Button>
