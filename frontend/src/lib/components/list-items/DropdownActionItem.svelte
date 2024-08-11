<script lang="ts">
	import { DropdownItem } from 'flowbite-svelte';

	export let text: string;
	export let onClick: () => void;
	export let dark: boolean = false;

	$: wrapperClass = dark
		? 'font-medium text-red-500 hover:text-red-700'
		: 'font-medium hover:text-primary-700';
</script>

<DropdownItem class={wrapperClass} on:click={onClick}>
	{text}
</DropdownItem>
