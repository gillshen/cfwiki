<script lang="ts">
	import { PenOutline } from 'flowbite-svelte-icons';
	import MultiActionButton from './MultiActionButton.svelte';

	export let updateAction: () => void;
	export let deleteAction: () => void;
	export let text: string = '';
</script>

<MultiActionButton
	{text}
	actions={[
		{ text: 'Update', action: updateAction },
		{ text: 'Delete', action: deleteAction, dark: true }
	]}
>
	<PenOutline slot="icon" />
</MultiActionButton>
