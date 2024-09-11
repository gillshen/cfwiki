<script lang="ts">
	import {
		Heading,
		Hr,
		Breadcrumb,
		BreadcrumbItem,
		Alert,
		Label,
		Select,
		Helper,
		A,
		Button
	} from 'flowbite-svelte';

	import { InfoCircleOutline, ChevronDoubleRightOutline } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms';

	import BreadcrumbLink from '$lib/components/misc/BreadcrumbLink.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import StagedAcademyProductCard from '$lib/components/student-page/StagedAcademyProductCard.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import AcademyProductForm from '$lib/components/academy-product-form/AcademyProductForm.svelte';
	import Toast from '$lib/components/misc/Toast.svelte';
	import { addChinesePadding, lexicalChineseLast } from '$lib/utils/stringUtils';

	export let data;

	let showToast = false;

	const { form, enhance } = superForm(data.productsUpdateForm, {
		dataType: 'json',
		onUpdated({ form }) {
			if (!form.valid) {
				showToast = true;
			}
		}
	});

	let productId: number | '';
	let productModal = false;
	let prepError = '';

	const stageProgram = () => {
		if (typeof productId !== 'number') {
			return;
		}

		if ($form.academy_products.includes(productId)) {
			prepError = 'You have already selected this program.';
			return;
		}
		prepError = '';
		$form.academy_products = [...$form.academy_products, productId as number];
		productId = '';
	};

	const removeStaged = (index: number) => {
		$form.academy_products = $form.academy_products
			.slice(0, index)
			.concat($form.academy_products.slice(index + 1));
	};
</script>

<Heading tag="h1" class="alt-page-title">{data.student.fullname} @ CF Academy</Heading>

<Hr />

<Breadcrumb class="mb-8">
	<BreadcrumbLink text={data.student.fullname} href={`/student/${data.student.id}`} />
	<BreadcrumbItem>CF Academy</BreadcrumbItem>
</Breadcrumb>

<form
	class="grid grid-cols-2 gap-4"
	method="post"
	action="?/updateStudentAcademyProducts"
	use:enhance
>
	{#await data.products}
		<FetchingDataSign divClass="mt-6" text="Preparing your form..." />
	{:then products}
		<div>
			<Alert color="light" class="form-width flex gap-2">
				<InfoCircleOutline />
				<span>
					Use the form below to select programs. The ones you&rsquo;ve selected will appear on the
					right. When done, click <strong>Update</strong>.
				</span>
			</Alert>

			<div class="form-width">
				<Label for="product" class="form-label">Program</Label>
				<Select id="product" bind:value={productId}>
					{#each products.sort((a, b) => lexicalChineseLast(a.name, b.name)) as product}
						<option value={product.id}>{addChinesePadding(product.name)}</option>
					{/each}
				</Select>
				<Helper class="form-helper mt-2"
					>If your desired program is not listed, you can create it by <A
						on:click={() => (productModal = true)}>clicking here</A
					>.</Helper
				>

				<Button
					outline
					type="button"
					class="mt-8 w-full"
					on:click={stageProgram}
					disabled={!productId}
				>
					Select<ChevronDoubleRightOutline class="ms-2" />
				</Button>
				{#if prepError}
					<Helper class="form-helper mt-4 flex items-center font-medium !text-red-500">
						{prepError}
					</Helper>
				{/if}
			</div>
		</div>

		<div class="h-fit min-h-[10rem] flex flex-col px-8 py-6 rounded-lg bg-stone-50">
			<Heading tag="h2" class="section-title mb-4">Selected programs</Heading>

			<div class="flex flex-col gap-4">
				{#each products.filter((p) => $form.academy_products.includes(p.id)) as product, i}
					<StagedAcademyProductCard item={product} onRemove={() => removeStaged(i)} />
				{/each}
			</div>

			<Button type="submit" class="w-fit mt-6 mb-2">Update</Button>
		</div>
	{/await}
</form>

<FormModal
	open={productModal}
	superform={data.newProductForm}
	fields={AcademyProductForm}
	action="?/createAcademyProduct"
	title="Create an Academy program"
	on:close={() => (productModal = false)}
/>

{#if showToast}
	<Toast type="error" onClose={() => (showToast = false)}>
		Sorry, something went wrong. Please try again later.
	</Toast>
{/if}
