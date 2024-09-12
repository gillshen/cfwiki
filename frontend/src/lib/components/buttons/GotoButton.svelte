<script lang="ts">
	import { ArrowLeftToBracketOutline } from 'flowbite-svelte-icons';

	export let href: string;
	export let text: string;
	export let icon: any | undefined = undefined;
</script>

<a {href} target="_self" class="flex text-gray-500 hover:text-primary-700">
	<svelte:component this={icon ?? ArrowLeftToBracketOutline} class="size-4 me-1" />
	<span class="text-xs font-normal">{text}</span>
</a>
