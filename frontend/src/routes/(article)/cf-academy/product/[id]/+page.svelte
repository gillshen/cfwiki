<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Button, Heading, Hr, Tooltip } from 'flowbite-svelte';

	import AcademyProductItem from '$lib/components/list-items/AcademyProductItem.svelte';
	import LinkWithIcon from '$lib/components/infobox/LinkWithIcon.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import BreadcrumbLink from '$lib/components/misc/BreadcrumbLink.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import AcademyProductForm from '$lib/components/academy-product-form/AcademyProductForm.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';

	export let data;

	let productModal = false;
	let productDeleteModal = false;

	// TODO let user with staff status override this
	$: canDelete = !data.product.students.length;
</script>

<Heading tag="h1" class="alt-page-title flex">
	<span>CF Academy |&nbsp;</span>
	<AcademyProductItem product={data.product} gap="gap-2" />
</Heading>

<Hr />

<article>
	<Breadcrumb>
		<BreadcrumbLink text="CF Academy" href="/cf-academy" />
		<BreadcrumbItem>
			<AcademyProductItem product={data.product} />
		</BreadcrumbItem>
	</Breadcrumb>

	<div class="flex gap-2 mt-8">
		<Button outline on:click={() => (productModal = true)}>Update</Button>

		<Button outline color="light" on:click={() => (productDeleteModal = true)} disabled={!canDelete}
			>Delete</Button
		>
		{#if !canDelete}
			<Tooltip class="tooltip max-w-sm" placement="right-end">
				You cannot delete this Academy product because it already has at least one participant.
			</Tooltip>
		{/if}
	</div>
</article>

<article class="mt-12">
	<Heading tag="h2" class="section-title">Participants</Heading>

	{#if data.product.students.length}
		<div class="flex flex-col gap-3 mt-6 text-sm">
			{#each data.product.students as student}
				<LinkWithIcon text={student.fullname} href={`/student/${student.id}`} iconFirst={true} />
			{/each}
		</div>
	{:else}
		<NoDataSign text="None" divClass="mt-6" />
	{/if}
</article>

<FormModal
	open={productModal}
	superform={data.productForm}
	fields={AcademyProductForm}
	entity={data.product}
	title="Update Academy product"
	action="?/updateAcademyProduct"
	on:close={() => (productModal = false)}
/>

<FormModal
	open={productDeleteModal}
	superform={data.deleteForm}
	fields={DeleteForm}
	entity={data.product}
	title="Delete Academy product"
	action="?/deleteAcademyProduct"
	on:close={() => (productDeleteModal = false)}
>
	<DeleteMessage
		slot="preface"
		name={`this Academy product (${data.product.name}), including the associated records of student participation, if any,`}
	/>
</FormModal>
