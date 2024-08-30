<script lang="ts">
	import { Spinner } from 'flowbite-svelte';

	export let divClass: string = '';
	export let text: string = 'Fetching data...';
</script>

<div class={`flex items-center gap-4 text-sm text-gray-500 ${divClass}`.trim()}>
	<Spinner />
	<div>{text}</div>
</div>
