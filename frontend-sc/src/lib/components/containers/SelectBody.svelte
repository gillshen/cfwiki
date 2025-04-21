<script lang="ts">
	import * as Select from '$lib/components/ui/select/index';
	import { cn } from '$lib/utils';

	export let items: { value: any; label: string }[];
	export let triggerClass: string | undefined = undefined;
	export let contentClass: string | undefined = undefined;
</script>

<Select.Trigger class={cn('w-full', triggerClass)}>
	<Select.Value />
</Select.Trigger>
<Select.Content class={cn('max-h-[360px] overflow-auto', contentClass)}>
	<slot name="top-items" />
	{#each items as { value, label }}
		<Select.Item {value}>{label}</Select.Item>
	{/each}
	<slot name="bottom-items" />
</Select.Content>
