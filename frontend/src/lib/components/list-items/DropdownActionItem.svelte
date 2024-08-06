<script lang="ts">
	import { DropdownItem } from 'flowbite-svelte';

	export let text: string;
	export let onClick: () => void;
	export let dark: boolean = false;

	let wrapperClass = 'font-normal hover:text-primary-700';
	if (dark) {
		wrapperClass = `${wrapperClass} font-medium`;
	}
</script>

<DropdownItem class={wrapperClass} on:click={onClick}>
	{text}
</DropdownItem>
