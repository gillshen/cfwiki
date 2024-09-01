<script lang="ts">
	import { Avatar } from 'flowbite-svelte';

	export let label: string;
	export let score: number | null;
</script>

{#if score !== null}
	<div class="flex flex-col gap-1 items-center">
		<Avatar class="size-[60px] bg-primary-700 text-white flex-shrink-0">{score}</Avatar>
		<div class="text-gray-900 font-medium">{label}</div>
	</div>
{/if}
