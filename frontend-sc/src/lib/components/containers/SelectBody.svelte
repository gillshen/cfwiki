<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Select from '$lib/components/ui/select/index';
	import { normalizeSelectItems, type SelectOption } from '$lib/util/formUtils';

	export let items: (SelectOption | string | number)[];
	export let triggerClass: string | undefined = undefined;
	export let contentClass: string | undefined = undefined;
</script>

<Select.Trigger class={cn('w-full', triggerClass)}>
	<Select.Value />
</Select.Trigger>
<Select.Content class={cn('max-h-[360px] overflow-auto', contentClass)}>
	<slot name="top-items" />
	{#each items.map(normalizeSelectItems) as { value, label }}
		<Select.Item {value}>{label}</Select.Item>
	{/each}
	<slot name="bottom-items" />
</Select.Content>
