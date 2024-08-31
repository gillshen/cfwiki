<script lang="ts">
	import { CheckOutline, CloseOutline } from 'flowbite-svelte-icons';

	export let checked: boolean;
	export let checkedText: string;
	export let unCheckedText: string | undefined = undefined;
</script>

<li class="flex gap-1 items-center">
	{#if checked}
		<CheckOutline size="sm" class="text-green-500" />
		<span class="text-green-500">{checkedText}</span>
	{:else}
		<CloseOutline size="sm" class="text-red-500" />
		<span class="text-red-500">{unCheckedText ?? checkedText}</span>
	{/if}
</li>
