<script lang="ts">
	import { Heading, Button } from 'flowbite-svelte';
</script>

<div class="flex flex-col w-full">
	<Heading tag="h1" class="text-3xl font-thin pb-8 text-center">You're logged out</Heading>

	<Button outline href="/login" class="w-fit uppercase tracking-wide mx-auto">Log back in</Button>
</div>
