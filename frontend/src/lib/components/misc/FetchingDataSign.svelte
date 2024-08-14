<script lang="ts">
	import { Spinner } from 'flowbite-svelte';

	export let divClass: string = '';
</script>

<div class={`flex items-center gap-4 text-sm text-gray-500 ${divClass}`.trim()}>
	<Spinner />
	<div>Fetching data...</div>
</div>
