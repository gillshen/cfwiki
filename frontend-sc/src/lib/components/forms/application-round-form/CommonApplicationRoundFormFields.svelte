<script lang="ts">
	import type { Infer, SuperForm } from 'sveltekit-superforms';
	import FormButton from '$lib/components/ui/form/form-button.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import type { CommonApplicationRoundSchema } from '$lib/schemas/applicationRound';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import { TIMEZONES } from '$lib/constants/timezones';

	export let form: SuperForm<Infer<CommonApplicationRoundSchema>>;
	const { form: formData } = form;

	const timezones: Record<string, string> = {
		'Applicant\u2019s local time': 'applicant',
		...TIMEZONES
	};
	const timezoneItems = Object.entries(timezones).map(([label]) => label);
</script>

<Input
	{form}
	name="name"
	label="Name"
	description="Use standard abbreviations like &ldquo;ED&rdquo;"
/>

<Input {form} name="due_date" type="date" label="Due date" optional />

<div class="flex gap-2 items-end">
	<Input
		{form}
		name="due_time"
		type="time"
		label="Due time"
		inputClass="tabular-nums w-[180px]"
		optional
	/>
	<Button
		type="button"
		variant="secondary"
		class="mb-3 h-7 px-3 text-xs"
		on:click={() => ($formData.due_time = '23:59')}>End of Day</Button
	>
</div>

<div class="flex flex-col pb-2">
	<Combobox
		{form}
		name="timezone"
		label="Timezone"
		items={timezoneItems}
		transformValue={(value) => timezones[value]}
		optional
	/>
	<div class="flex gap-2 items-center">
		<Button
			type="button"
			variant="secondary"
			class="h-7 px-3 text-xs"
			on:click={() => ($formData.timezone = 'applicant')}>Applicant&rsquo;s local time</Button
		>
		<Button
			type="button"
			variant="secondary"
			class="h-7 px-3 text-xs"
			on:click={() => ($formData.timezone = 'America/New_York')}>US Eastern</Button
		>
		<Button
			type="button"
			variant="secondary"
			class="h-7 px-3 text-xs"
			on:click={() => ($formData.timezone = 'America/Los_Angeles')}>US Pacific</Button
		>
	</div>
</div>

<Input {form} name="decision_date" type="date" label="Decision date" optional />

<FormButton class="w-fit min-w-24">Submit</FormButton>
<!-- <SuperDebug data={$formData} /> -->
