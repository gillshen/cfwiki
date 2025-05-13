<script lang="ts">
	import { type Variant } from '$lib/components/ui/badge/index';
	import { cn } from '$lib/utils';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import X from 'lucide-svelte/icons/x';

	export let variant: Variant = 'secondary';
	export let type: 'button' | 'submit' = 'button';
	export let onDismiss: (() => void) | undefined = undefined;
	export let className: string = '';
	export { className as class };
</script>

<Badge {variant} class={cn('flex items-center gap-1 shrink-0 h-5', className)}>
	<slot />
	<button
		{type}
		class="bg-transparent p-0 m-0 border-none"
		on:click|stopPropagation|preventDefault={onDismiss}><X class="size-3" /></button
	>
</Badge>
