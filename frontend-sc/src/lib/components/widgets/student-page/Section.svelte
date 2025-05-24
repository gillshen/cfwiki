<script lang="ts">
	import type { ComponentType } from 'svelte';
	import * as Card from '$lib/components/ui/card/';

	export let title: string;
	export let icon: ComponentType;
	export let footer: boolean = false;
</script>

<section>
	<h3 class="text-sm text-muted-foreground mb-2 px-5 flex items-center">
		<svelte:component this={icon} class="size-[14px] mr-2" />
		{title}
	</h3>
	<Card.Root class="text-sm shadow-none max-w-prose">
		<Card.Content class="py-4">
			<slot />
		</Card.Content>
		{#if footer}
			<Card.Footer class="border-t pb-4">
				<slot name="footer" />
			</Card.Footer>
		{/if}
	</Card.Root>
</section>
