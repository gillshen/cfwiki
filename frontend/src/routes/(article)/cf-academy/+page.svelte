<script lang="ts">
	import { Button, Heading, Hr, A } from 'flowbite-svelte';
	import { LinkOutline } from 'flowbite-svelte-icons';

	import AcademyProductItem from '$lib/components/list-items/AcademyProductItem.svelte';
	import AcademyProductForm from '$lib/components/academy-product-form/AcademyProductForm.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import { lexicalChineseLast } from '$lib/utils/stringUtils';

	export let data;

	let productModal = false;
</script>

<Heading tag="h1" class="page-title">CF Academy</Heading>

<Hr />

<Heading tag="h2" class="section-title">Products</Heading>

{#await data.products then products}
	{#if products.length}
		<div class="grid grid-cols-4 gap-y-3 gap-x-6 mt-6 text-sm">
			{#each products.sort((a, b) => lexicalChineseLast(a.name, b.name)) as product}
				<A href={`/cf-academy/product/${product.id}`} class="w-fit">
					<LinkOutline size="sm" class="me-2" />
					<AcademyProductItem {product} spanClass="text-gray-900" />
				</A>
			{/each}
		</div>
	{/if}
{/await}

<Button outline class="w-fit mt-8" on:click={() => (productModal = true)}>Add a product</Button>

<FormModal
	open={productModal}
	superform={data.productForm}
	fields={AcademyProductForm}
	action="?/createAcademyProduct"
	title="Add an Academy product"
	on:close={() => (productModal = false)}
/>
