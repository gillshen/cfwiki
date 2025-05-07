<script lang="ts">
	import { cn } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import MoveRight from 'lucide-svelte/icons/move-right';

	export let href: string = '';
	export let className: string = '';
	export let iconClass: string = '';
	export { className as class };
</script>

<Button
	size="icon"
	variant="link"
	class={cn('font-normal text-primary hover:no-underline hover:text-mint-600', className)}
	{href}
>
	<MoveRight class={cn('size-4', iconClass)} />
</Button>
