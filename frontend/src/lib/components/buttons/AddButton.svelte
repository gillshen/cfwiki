<script lang="ts">
	import { PlusOutline } from 'flowbite-svelte-icons';
	import Button from '$lib/components/buttons/Button.svelte';

	export let onClick: () => any;
	export let text: string;
	export let disabled: boolean = false;
</script>

<Button {onClick} {text} icon={PlusOutline} {disabled} />
