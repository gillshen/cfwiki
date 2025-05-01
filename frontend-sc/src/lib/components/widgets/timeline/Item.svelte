<script lang="ts">
	import { cn } from '$lib/utils';

	export let className: string = '';
	export { className as class };
</script>

<div class="flex">
	<!-- Node and line -->
	<div class="border-r w-2 shrink-0 mt-6 pt-2 mr-4">
		<div class="w-2 h-2 bg-cultured-400 rounded-full -translate-y-6 translate-x-1" />
	</div>

	<!-- Content -->
	<div class={cn('pb-4', className)}>
		<slot />
	</div>
</div>
