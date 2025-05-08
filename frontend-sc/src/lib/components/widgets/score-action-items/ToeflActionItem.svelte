<script lang="ts">
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import ToeflIeltsActionItem from './ToeflIeltsActionItem.svelte';
	import type { ToeflSchema } from '$lib/schemas/scores';
	import type { DeleteSchema } from '$lib/schemas/delete';
	import type { ToeflScore } from '$lib/api/scores';

	export let score: ToeflScore;
	export let studentId: number;
	export let updateForm: SuperValidated<Infer<ToeflSchema>>;
	export let deleteForm: SuperValidated<Infer<DeleteSchema>>;
</script>

<ToeflIeltsActionItem
	testType="TOEFL"
	{score}
	{studentId}
	{updateForm}
	{deleteForm}
	updateAction="?/createOrUpdateToeflScore"
	deleteAction="?/deleteToeflScore"
/>
