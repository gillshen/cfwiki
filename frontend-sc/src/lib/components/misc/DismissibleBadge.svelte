<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { type Variant } from '$lib/components/ui/badge/index';
	import X from 'lucide-svelte/icons/x';

	export let variant: Variant = 'secondary';
	export let onDismiss: () => void = () => {};
</script>

<Badge {variant} class="flex items-center gap-1 shrink-0">
	<slot />
	<button class="bg-transparent p-0 m-0 border-none" on:click={onDismiss}
		><X class="size-3" /></button
	>
</Badge>
