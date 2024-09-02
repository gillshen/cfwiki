<script lang="ts">
	import { Avatar } from 'flowbite-svelte';

	export let score: number | string;
	export let count: number;
</script>

<div class="flex gap-1 items-center">
	<Avatar class="size-[30px] bg-primary-700 text-white flex-shrink-0">
		{score}
	</Avatar>
	<span>&times;{count}</span>
</div>
