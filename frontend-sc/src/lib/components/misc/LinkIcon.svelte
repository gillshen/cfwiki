<script lang="ts">
	import SquareArrowOutUpRight from 'lucide-svelte/icons/square-arrow-out-up-right';

	export let href: string;
	export let target: '_self' | '_blank' = '_self';
	export let size: number = 4;
	export let iconClass: string = '';
</script>

<a {href} {target}>
	<SquareArrowOutUpRight class={`size-${size} ${iconClass}`.trim()} />
</a>
