<script lang="ts">
	import * as RadioGroup from '$lib/components/ui/radio-group/index';
	import Label from '$lib/components/ui/label/label.svelte';
	import { normalizeSelectItems, type SelectOption } from '$lib/util/formUtils';

	export let value: string | number;
	export let items: (SelectOption | string | number)[];
	export let onValueChange: (value?: string | undefined) => void = () => {};
</script>

<RadioGroup.Root bind:value {onValueChange}>
	{#each items.map(normalizeSelectItems) as { label, value }}
		{@const id = Math.random().toString()}
		<div class="flex items-center space-x-3">
			<RadioGroup.Item {value} {id} />
			<Label for={id} class="font-normal">{label}</Label>
		</div>
	{/each}
</RadioGroup.Root>
