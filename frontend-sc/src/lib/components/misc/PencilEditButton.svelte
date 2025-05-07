<script lang="ts">
	import { cn } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import Pencil from 'lucide-svelte/icons/pencil-line';

	export let text: string = 'Edit';
	export let href: string = '';
	export let className: string = '';
	export let iconClass: string = '';
	export { className as class };
</script>

<Button
	variant="link"
	{href}
	class={cn('font-normal text-muted-foreground hover:no-underline hover:text-mint-600', className)}
>
	<Pencil class={cn('mr-1 size-4', iconClass)} />{text}
</Button>
