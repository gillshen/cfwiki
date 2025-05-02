<script lang="ts">
	import { cn } from '$lib/utils';

	export let className: string = '';
	export { className as class };
</script>

<div class={cn('flex items-start', className)}>
	<!-- Node and line -->
	<div class="border-r border-primary/40 w-2 h-full shrink-0 mt-8 mr-4 relative">
		<div class="absolute left-1 -top-4 w-2 h-2 bg-primary rounded-full" />
	</div>

	<!-- Content -->
	<div class="mt-2">
		<slot />
	</div>
</div>
