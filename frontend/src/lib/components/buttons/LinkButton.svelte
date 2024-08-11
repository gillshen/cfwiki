<script lang="ts">
	import { A } from 'flowbite-svelte';

	export let text: string;
	export let action: () => void;
</script>

<A class="flex gap-2 items-center w-fit" on:click={action}>
	<slot name="icon" />
	{#if text}
		<span class="text-sm font-medium">{text}</span>
	{/if}
</A>
