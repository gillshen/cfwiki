<script lang="ts">
	import { A } from 'flowbite-svelte';
	import { LinkOutline } from 'flowbite-svelte-icons';

	export let href: string = '';
	export let text: string = '';
	export let iconFirst: boolean = false;
	export let spanClass: string = '';
</script>

<A {href} class="w-fit">
	{#if iconFirst}
		<LinkOutline size="sm" class="me-2" />
	{/if}
	<span class={spanClass || 'text-gray-900'}>{text}</span>
	{#if !iconFirst}
		<LinkOutline size="sm" class="ms-2" />
	{/if}
</A>
