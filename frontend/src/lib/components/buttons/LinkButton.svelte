<script lang="ts">
	import { A } from 'flowbite-svelte';

	export let text: string;
	export let action: () => void;
</script>

<A class="flex gap-1 items-center w-fit" on:click={action}>
	<slot name="icon" />
	{#if text}
		<span class="text-xs uppercase tracking-wide">{text}</span>
	{/if}
</A>
