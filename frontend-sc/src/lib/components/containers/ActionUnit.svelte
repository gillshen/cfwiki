<script lang="ts">
	import Pencil from 'lucide-svelte/icons/pencil';
	import X from 'lucide-svelte/icons/x';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';

	export let updateDiologTitle: string;
	export let deleteDialogTitle: string;

	const closeUpdateModal = () => (updateModal = false);
	const closeDeleteModal = () => (deleteModal = false);

	let updateModal = false;
	let deleteModal = false;
</script>

<ButtonDialog buttonSlot dialogTitle={updateDiologTitle} bind:open={updateModal}>
	<Pencil
		class="size-4 text-muted-foreground hover:text-mint-600 translate-y-[1px]"
		slot="button"
	/>
	<slot name="update-form" {closeUpdateModal} />
</ButtonDialog>

<ButtonDialog
	buttonSlot
	dialogTitle={deleteDialogTitle}
	bind:open={deleteModal}
	contentClass="pb-2"
>
	<X class="size-4 text-muted-foreground hover:text-mint-600 translate-y-[1px]" slot="button" />
	<p slot="description" class="text-pretty">Deletion is instant and irreversible.</p>
	<slot name="delete-form" {closeDeleteModal} />
</ButtonDialog>
