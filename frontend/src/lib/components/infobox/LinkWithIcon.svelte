<script lang="ts">
	import { A } from 'flowbite-svelte';
	import { LinkOutline } from 'flowbite-svelte-icons';

	export let href: string = '';
	export let text: string = '';
	export let iconFirst: boolean = false;
</script>

<A {href}>
	{#if iconFirst}
		<LinkOutline class="size-4 me-2" />
	{/if}
	<span class="text-gray-900">{text}</span>
	{#if !iconFirst}
		<LinkOutline class="size-4 ms-2" />
	{/if}
</A>
