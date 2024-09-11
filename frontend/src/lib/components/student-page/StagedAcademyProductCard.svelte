<script lang="ts">
	import { Card, CloseButton } from 'flowbite-svelte';

	import type { AcademyProductListItem } from '$lib/api/academyProduct';
	import AcademyProductItem from '$lib/components/list-items/AcademyProductItem.svelte';

	export let item: AcademyProductListItem;
	export let onRemove: () => void = () => {};
</script>

<Card padding="md" size="lg">
	<div class="flex justify-between items-center w-full">
		<AcademyProductItem product={item} spanClass="text-sm" />

		<div><CloseButton on:click={onRemove} /></div>
	</div>
</Card>
