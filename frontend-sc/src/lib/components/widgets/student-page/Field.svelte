<script lang="ts">
	import type { ComponentType } from 'svelte';

	export let icon: ComponentType;
	export let key: string;
	export let value: string | null | undefined;
	export let defaultText: string = 'n/a';
</script>

<hgroup class="flex flex-col gap-1">
	<h3 class="text-muted-foreground inline-flex items-center">
		<svelte:component this={icon} class="size-3.5 mr-2" />
		{key}
	</h3>
	{#if value}
		<p class="ml-[22px]">{value}</p>
	{:else}
		<p class="ml-[22px] text-muted-foreground">{defaultText}</p>
	{/if}
</hgroup>
