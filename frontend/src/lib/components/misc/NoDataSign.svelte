<script lang="ts">
	import { CircleMinusOutline } from 'flowbite-svelte-icons';
	export let text: string;
	export let divClass: string = '';
</script>

<div class={`flex items-center gap-2 text-sm text-gray-500 ${divClass}`.trim()}>
	<CircleMinusOutline /><span>{text}</span>
</div>
