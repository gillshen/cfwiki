<script lang="ts">
	import type { ComponentType } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { buttonVariants } from '$lib/components/ui/button/index';
	import { cn } from '$lib/utils';

	export let buttonVariant:
		| 'outline'
		| 'default'
		| 'destructive'
		| 'secondary'
		| 'ghost'
		| 'link'
		| undefined = 'outline';
	export let buttonSize: 'sm' | 'default' | 'lg' | 'icon' | undefined = 'default';
	export let buttonText: string = '';
	export let buttonIcon: ComponentType | undefined = undefined;
	export let buttonIconClass: string = '';
	export let buttonClass: string = '';
	export let buttonSlot: boolean = false;
	export let contentClass: string = '';
	export let dialogTitle: string = '';
	export let open: boolean = false;
	export let disabled: boolean = false;
</script>

<Dialog.Root bind:open>
	{#if buttonSlot}
		<Dialog.Trigger>
			<slot name="button" />
		</Dialog.Trigger>
	{:else}
		<Dialog.Trigger
			class={cn(
				buttonVariants({ variant: buttonVariant, size: buttonSize }),
				'flex items-center',
				buttonClass
			)}
			{disabled}
		>
			{#if buttonIcon}
				<svelte:component this={buttonIcon} class={buttonIconClass} />
			{/if}
			{buttonText}
		</Dialog.Trigger>
	{/if}
	<Dialog.Content class={cn('max-h-[calc(100vh-48px)] overflow-auto bg-white', contentClass)}>
		<Dialog.Header>
			{#if dialogTitle}
				<Dialog.Title>{dialogTitle}</Dialog.Title>
			{/if}
			<Dialog.Description>
				<slot name="description" />
			</Dialog.Description>
		</Dialog.Header>
		<slot />
	</Dialog.Content>
</Dialog.Root>
