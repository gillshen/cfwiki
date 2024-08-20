<script lang="ts">
	import { A } from 'flowbite-svelte';
	import { LinkOutline } from 'flowbite-svelte-icons';

	export let href: string = '';
	export let text: string = '';
</script>

<A {href}>
	<span class="text-gray-900">{text}</span>
	<LinkOutline class="size-4 ms-2" />
</A>
