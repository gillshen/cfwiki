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
	class={cn(
		'font-normal size-7 rounded-full text-primary hover:no-underline bg-mint-400 hover:bg-mint-300 transition-colors duration-300 ease-in-out',
		className
	)}
	{href}
>
	<MoveRight class={cn('size-3', iconClass)} />
</Button>
