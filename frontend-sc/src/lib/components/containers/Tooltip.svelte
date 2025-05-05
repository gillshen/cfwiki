<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index';
	export let text: string;
	export let className: string = '';
	export { className as class };
</script>

<Tooltip.Root>
	<Tooltip.Trigger class={className}>
		<slot />
	</Tooltip.Trigger>
	<Tooltip.Content>{text}</Tooltip.Content>
</Tooltip.Root>
