<script lang="ts">
	import { randomEmoji } from '$lib/constants/emoji';
	import { Heading } from 'flowbite-svelte';

	export let status: number;
	export let message: string | undefined;
</script>

<div class="m-auto flex flex-col gap-8 justify-center">
	<Heading tag="h1" class="font-thin text-gray-400 text-center">{randomEmoji()}</Heading>

	<div class="flex flex-col gap-4">
		<div class="text-2xl font-thin text-gray-700 mx-auto">
			<span class="font-normal">{status}</span> <span>| {message}</span>
		</div>
		<div class="text-sm font-normal mx-auto text-gray-700">
			<slot />
		</div>
	</div>
</div>
