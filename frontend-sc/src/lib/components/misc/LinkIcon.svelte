<script lang="ts">
	import SquareArrowOutUpRight from 'lucide-svelte/icons/square-arrow-out-up-right';
	import { cn } from '$lib/utils';

	export let href: string;
	export let target: '_self' | '_blank' = '_self';
	export let size: number = 4;
	export let className: string = '';
	export { className as class };
</script>

<a {href} {target}>
	<SquareArrowOutUpRight class={cn(`size-${size}`, className)} />
</a>
