<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { buttonVariants } from '$lib/components/ui/button/index';

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
	export let contentClass: string = '';
	export let dialogTitle: string = '';
	export let open: boolean = false;
	export let disabled: boolean = false;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: buttonVariant, size: buttonSize })} {disabled}
		>{buttonText}</Dialog.Trigger
	>
	<Dialog.Content class={contentClass}>
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
