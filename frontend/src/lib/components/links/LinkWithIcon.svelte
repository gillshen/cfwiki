<script lang="ts">
	import { A, P, type PsizeType } from 'flowbite-svelte';
	import { LinkOutline } from 'flowbite-svelte-icons';

	export let href: string = '';
	export let text: string = '';
	export let size: PsizeType = 'sm';
</script>

<A {href} class="flex gap-1 items-start justify-between">
	<P {size} class="w-fit">{text}</P>
	<LinkOutline class="size-4" />
</A>
