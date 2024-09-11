<script lang="ts">
	import { Button, Heading, Hr } from 'flowbite-svelte';

	import AcademyProductItems from '$lib/components/list-items/AcademyProductItems.svelte';
	import AcademyProductForm from '$lib/components/academy-product-form/AcademyProductForm.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';

	export let data;

	let productModal = false;
</script>

<Heading tag="h1" class="page-title">CF Academy</Heading>

<Hr />

<Heading tag="h2" class="section-title">Programs</Heading>

{#await data.products}
	<FetchingDataSign divClass="mt-6" />
{:then products}
	{#if products.length}
		<div class="grid grid-cols-4 gap-y-3 gap-x-6 mt-6 text-sm">
			<AcademyProductItems {products} />
		</div>
	{/if}
{/await}

<Button outline class="w-fit mt-8" on:click={() => (productModal = true)}>Create a program</Button>

<FormModal
	open={productModal}
	superform={data.productForm}
	fields={AcademyProductForm}
	action="?/createAcademyProduct"
	title="Create an Academy program"
	on:close={() => (productModal = false)}
/>
