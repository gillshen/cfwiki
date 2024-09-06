<script lang="ts">
	import { Heading } from 'flowbite-svelte';

	export let title: string;
</script>

<Heading tag="h3" class="mt-4 text-lg font-medium px-2 pb-0.5 border-b-2 border-primary-400">
	{title}
</Heading>
