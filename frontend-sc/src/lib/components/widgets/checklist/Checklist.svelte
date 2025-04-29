<script lang="ts">
	import { cn } from '$lib/utils';
	export let className;
	export { className as class };
</script>

<ul class={cn('flex flex-col', className)}>
	<slot />
</ul>
