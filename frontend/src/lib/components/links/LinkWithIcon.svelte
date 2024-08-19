<script lang="ts">
	import { A, P, type PsizeType } from 'flowbite-svelte';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';

	export let href: string = '';
	export let text: string = '';
	export let size: PsizeType = 'sm';
</script>

<A {href} class="flex gap-1 items-start justify-between">
	<P {size} class="w-fit">{text}</P>
	<ArrowUpRightFromSquareOutline class="w-4 h-4" />
</A>
