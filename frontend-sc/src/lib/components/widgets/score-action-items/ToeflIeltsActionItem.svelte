<script lang="ts">
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import Pencil from 'lucide-svelte/icons/pencil';
	import X from 'lucide-svelte/icons/x';

	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import ToeflIeltsForm from '$lib/components/forms/score-forms/ToeflIeltsForm.svelte';
	import DeleteForm from '$lib/components/forms/DeleteForm.svelte';

	import type { IeltsSchema, ToeflSchema } from '$lib/schemas/scores';
	import type { DeleteSchema } from '$lib/schemas/delete';
	import type { IeltsScore, ToeflScore } from '$lib/api/scores';

	export let testType: 'TOEFL' | 'IELTS';
	export let score: IeltsScore | ToeflScore;
	export let studentId: number;
	export let updateForm: SuperValidated<Infer<IeltsSchema>> | SuperValidated<Infer<ToeflSchema>>;
	export let deleteForm: SuperValidated<Infer<DeleteSchema>>;
	export let updateAction: string;
	export let deleteAction: string;

	let updateModal = false;
	let deleteModal = false;
</script>

<ButtonDialog buttonSlot dialogTitle="Update {testType} Score" bind:open={updateModal}>
	<Pencil
		class="size-4 text-muted-foreground hover:text-mint-600 translate-y-[1px]"
		slot="button"
	/>
	<ToeflIeltsForm
		data={updateForm}
		action={updateAction}
		{score}
		{studentId}
		onUpdated={({ form }) => form.valid && (updateModal = false)}
	/>
</ButtonDialog>

<ButtonDialog buttonSlot dialogTitle="Delete this {testType} score?" bind:open={deleteModal}>
	<X class="size-4 text-muted-foreground hover:text-mint-600 translate-y-[1px]" slot="button" />
	<p slot="description" class="text-pretty">Deletion is instant and permanent</p>
	<DeleteForm
		data={deleteForm}
		objectId={score.id}
		action={deleteAction}
		onUpdated={({ form }) => form.valid && (deleteModal = false)}
		onCancel={() => (deleteModal = false)}
	/>
</ButtonDialog>
