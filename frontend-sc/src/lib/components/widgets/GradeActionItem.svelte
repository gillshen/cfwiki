<script lang="ts">
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { GradeSchema } from '$lib/schemas/grade';
	import type { DeleteSchema } from '$lib/schemas/delete';

	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import Pencil from 'lucide-svelte/icons/pencil';
	import X from 'lucide-svelte/icons/x';
	import GradeForm from '$lib/components/forms/GradeForm.svelte';
	import DeleteForm from '$lib/components/forms/DeleteForm.svelte';

	import type { Grade } from '$lib/api/grade';

	export let grade: Grade;
	export let enrollmentId: number;
	export let progressions: string[];
	export let updateForm: SuperValidated<Infer<GradeSchema>>;
	export let deleteForm: SuperValidated<Infer<DeleteSchema>>;

	let updateModal = false;
	let deleteModal = false;
</script>

<ButtonDialog buttonSlot dialogTitle="Update Grade" bind:open={updateModal}>
	<Pencil class="size-4 text-muted-foreground hover:text-mint-600" slot="button" />
	<p slot="description">{grade.progression} - {grade.term}</p>
	<GradeForm
		data={updateForm}
		{grade}
		{enrollmentId}
		{progressions}
		onUpdated={({ form }) => form.valid && (updateModal = false)}
	/>
</ButtonDialog>

<ButtonDialog
	buttonSlot
	dialogTitle="Delete the {grade.term} grade of {grade.progression}?"
	contentClass="pb-2"
	bind:open={deleteModal}
>
	<X class="size-4 text-muted-foreground hover:text-mint-600" slot="button" />
	<p slot="description" class="text-pretty">Deletion is instant and irreversible.</p>
	<DeleteForm
		data={deleteForm}
		objectId={grade.id}
		action="?/deleteGrade"
		onUpdated={({ form }) => form.valid && (deleteModal = false)}
		onCancel={() => (deleteModal = false)}
	/>
</ButtonDialog>
