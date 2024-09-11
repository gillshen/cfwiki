<script lang="ts">
	import { A } from 'flowbite-svelte';
	import { LinkOutline } from 'flowbite-svelte-icons';

	import type { AcademyProductListItem } from '$lib/api/academyProduct';
	import AcademyProductItem from '$lib/components/list-items/AcademyProductItem.svelte';
	import { lexicalChineseLast } from '$lib/utils/stringUtils';

	export let products: AcademyProductListItem[];
</script>

{#each products.sort((a, b) => lexicalChineseLast(a.name, b.name)) as product}
	<A href={`/cf-academy/product/${product.id}`} class="w-fit">
		<LinkOutline size="sm" class="me-2" />
		<AcademyProductItem {product} spanClass="text-gray-900" />
	</A>
{/each}
