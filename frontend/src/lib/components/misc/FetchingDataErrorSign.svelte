<script lang="ts">
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';

	export let text: string = '';
	export let divClass: string = '';
</script>

<div class={`flex items-center gap-2 text-sm text-red-700 ${divClass}`.trim()}>
	<ExclamationCircleOutline />
	<span>{text || 'Sorry, an error occurred while fecting data.'}</span>
</div>
