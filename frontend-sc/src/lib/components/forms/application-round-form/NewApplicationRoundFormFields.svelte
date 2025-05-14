<script lang="ts">
	import type { Infer, SuperForm } from 'sveltekit-superforms';

	import type {
		CommonApplicationRoundSchema,
		NewApplicationRoundSchema
	} from '$lib/schemas/applicationRound';

	import Combobox from '$lib/components/forms/Combobox.svelte';
	import CommonApplicationRoundFormFields from './CommonApplicationRoundFormFields.svelte';
	import { ACADEMIC_TERMS } from '$lib/constants/progressions';
	import { activeYears } from '$lib/util/dateUtils';

	export let form: SuperForm<Infer<NewApplicationRoundSchema>>;
	export let programId: number;
	export let year: number | undefined = undefined;
	export let term: string | undefined = undefined;

	const _form = form as unknown as SuperForm<Infer<CommonApplicationRoundSchema>>;
</script>

<input type="number" name="program" value={programId} hidden />

{#if year === undefined}
	<Combobox {form} name="year" label="Year" items={activeYears()} />
{:else}
	<input type="number" name="year" value={year} hidden />
{/if}

{#if term === undefined}
	<Combobox {form} name="term" label="Term" items={[...ACADEMIC_TERMS]} />
{:else}
	<input name="term" value={term} hidden />
{/if}

<CommonApplicationRoundFormFields form={_form} />
