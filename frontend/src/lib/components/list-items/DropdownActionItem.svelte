<script lang="ts">
	import { DropdownItem } from 'flowbite-svelte';

	export let text: string;
	export let onClick: () => void;
	export let dark: boolean = false;

	let wrapperClass: string;
	if (dark) {
		wrapperClass = 'font-medium hover:text-red-700';
	} else {
		wrapperClass = 'font-normal hover:text-primary-700';
	}
</script>

<DropdownItem class={wrapperClass} on:click={onClick}>
	{text}
</DropdownItem>
