<script lang="ts">
	import { TrashBinOutline } from 'flowbite-svelte-icons';
	import Button from '$lib/components/buttons/Button.svelte';

	export let onClick: () => any;
	export let disabled: boolean = false;
</script>

<Button {onClick} text="Delete" icon={TrashBinOutline} {disabled} />
