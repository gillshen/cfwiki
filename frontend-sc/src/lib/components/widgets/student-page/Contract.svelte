<script lang="ts">
	import { cn } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import MoveRight from 'lucide-svelte/icons/move-right';
	import type { Contract } from '$lib/api/student';

	export let contract: Contract;
	export let editable: boolean = false;
	export let editMode: boolean = false;
	export let href: string = '';

	$: contractTitle = `${contract.type} ${contract.target_year}`;
</script>

<div class="flex flex-col gap-1 my-2">
	{#if !editMode}
		<div class="flex items-center justify-between h-6 px-4">
			<h3 class="font-medium py-0">{contractTitle}</h3>
			<div>{contract.status}</div>
		</div>
	{:else if editable}
		<div class="flex items-center justify-between">
			<Button variant="link" {href} class="h-6"
				>{contractTitle}<MoveRight class="size-4 ml-2" /></Button
			>
		</div>
	{:else}
		<div class="flex items-center justify-between">
			<Button
				variant="link"
				href=""
				class="h-6 text-muted-foreground hover:no-underline hover:cursor-not-allowed"
				>{contractTitle}</Button
			>
		</div>
	{/if}
	<p
		class={cn(
			'text-xs px-4',
			editMode && !editable ? 'text-muted-foreground/70' : 'text-muted-foreground'
		)}
	>
		{contract.services
			.map((s) => s.cf_username)
			.sort()
			.join(', ')}
	</p>
</div>
