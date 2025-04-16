<script lang="ts">
	import { cn } from '$lib/utils';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	export let text: string = 'Fetching data...';
	export let className: string = '';
	export { className as class };
</script>

<div class={cn('flex gap-2 items-center', className)}>
	<LoaderCircle class="animate-spin w-4 h-4" />
	<div class="animate-pulse text-sm">{text}</div>
</div>
