<script lang="ts">
	import { cn } from '$lib/utils';
	import type { ComponentType } from 'svelte';
	import * as Card from '$lib/components/ui/card/';

	export let title: string;
	export let icon: ComponentType | undefined = undefined;
	export let footer: boolean = false;
	export let className: string = '';
	export let contentClass: string = '';
	export let footerClass: string = '';
	export { className as class };
</script>

<section class={className}>
	<h3 class="text-sm text-muted-foreground mb-2 px-5 flex items-center">
		<svelte:component this={icon} class="size-[14px] mr-2" />
		{title}
	</h3>
	<Card.Root class="text-sm shadow-none max-w-prose">
		<Card.Content class={cn('py-4', contentClass)}>
			<slot />
		</Card.Content>
		{#if footer}
			<Card.Footer class={cn('border-t pb-4', footerClass)}>
				<slot name="footer" />
			</Card.Footer>
		{/if}
	</Card.Root>
</section>
