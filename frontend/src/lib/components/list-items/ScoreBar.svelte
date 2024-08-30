<script lang="ts">
	import { Progressbar, P } from 'flowbite-svelte';

	export let label: string;
	export let percentage: number;
	export let value: number | string | null;
</script>

<div>
	<P size="sm" class="font-medium -mb-1">{label}</P>
	<div class="flex gap-4 items-center">
		<Progressbar progress={percentage} class="w-[250px]" />
		{#if value !== null}
			<P class="font-medium flex-none w-8">{value}</P>
		{:else}
			<P size="sm" color="text-gray-400" class="font-medium flex-none w-8">N/A</P>
		{/if}
	</div>
</div>
