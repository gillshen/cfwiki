<script lang="ts">
	import { PenOutline } from 'flowbite-svelte-icons';
	import MultiActionButton from '$lib/components/buttons/MultiActionButton.svelte';

	export let updateAction: () => void;
	export let deleteAction: () => void;
	export let text: string = '';
	export let updateDisabled: boolean = false;
	export let deleteDisabled: boolean = false;
</script>

<MultiActionButton
	{text}
	actions={[
		{ text: 'Update', action: updateAction, disabled: updateDisabled },
		{ text: 'Delete', action: deleteAction, disabled: deleteDisabled, dark: true }
	]}
	disabled={updateDisabled && deleteDisabled}
>
	<PenOutline slot="icon" />
</MultiActionButton>
