<script lang="ts">
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import ToeflIeltsActionItem from './ToeflIeltsActionItem.svelte';
	import type { IeltsSchema } from '$lib/schemas/scores';
	import type { DeleteSchema } from '$lib/schemas/delete';
	import type { IeltsScore } from '$lib/api/scores';

	export let score: IeltsScore;
	export let studentId: number;
	export let updateForm: SuperValidated<Infer<IeltsSchema>>;
	export let deleteForm: SuperValidated<Infer<DeleteSchema>>;
</script>

<ToeflIeltsActionItem
	testType="IELTS"
	{score}
	{studentId}
	{updateForm}
	{deleteForm}
	updateAction="?/createOrUpdateIeltsScore"
	deleteAction="?/deleteIeltsScore"
/>
