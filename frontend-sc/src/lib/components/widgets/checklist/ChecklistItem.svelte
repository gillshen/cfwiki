<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import X from 'lucide-svelte/icons/x';

	export let checked: boolean | null = false;
	export let text: string;
	export let passText: string | undefined = undefined;
	export let failText: string | undefined = undefined;
</script>

<li class="flex gap-1 items-center">
	{#if checked === null}
		<div class="size-4 text-center -translate-y-[2px]">&bullet;</div>
		<span>{text}</span>
	{:else if checked}
		<Check class="size-4" />
		<span>{passText ?? text}</span>
	{:else}
		<X class="size-4 text-rose-700/80" />
		<span class="text-rose-700/80">{failText ?? text}</span>
	{/if}
</li>
