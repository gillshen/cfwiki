<script lang="ts">
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import type { IeltsScore } from '$lib/api/scores';
	import type { IeltsSchema } from '$lib/schemas/scores';
	import ToeflIeltsForm from './ToeflIeltsForm.svelte';

	export let data: SuperValidated<Infer<IeltsSchema>>;
	export let onUpdated: (event: { form: typeof data }) => any;
	export let action: string = '?/createOrUpdateIeltsScore';
	export let className: string = '';
	export let studentId: number;
	export let score: IeltsScore | undefined = undefined;
	export { className as class };
</script>

<ToeflIeltsForm {data} {onUpdated} {action} {studentId} {score} class={className} />
