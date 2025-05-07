<script lang="ts">
	import LinkIcon from '$lib/components/misc/LinkIcon.svelte';

	export let href: string;
	export let target: '_self' | '_blank' = '_self';
	export let size: number = 4;
	export let className: string = 'text-mint-600';
	export { className as class };
</script>

<div class="flex h-[39px] items-center">
	<LinkIcon {href} {target} {size} class={className} />
</div>
