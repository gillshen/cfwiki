<script lang="ts">
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import type { ToeflScore } from '$lib/api/scores';
	import type { ToeflSchema } from '$lib/schemas/scores';
	import ToeflIeltsForm from './ToeflIeltsForm.svelte';

	export let data: SuperValidated<Infer<ToeflSchema>>;
	export let onUpdated: (event: { form: typeof data }) => any;
	export let action: string = '?/createOrUpdateToeflScore';
	export let className: string = '';
	export let studentId: number;
	export let score: ToeflScore | undefined = undefined;
	export { className as class };
</script>

<ToeflIeltsForm {data} {onUpdated} {action} {studentId} {score} class={className} />
