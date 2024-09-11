<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Button, Heading, Hr, Tooltip } from 'flowbite-svelte';

	import AcademyProgramItem from '$lib/components/list-items/AcademyProgramItem.svelte';
	import LinkWithIcon from '$lib/components/infobox/LinkWithIcon.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import BreadcrumbLink from '$lib/components/misc/BreadcrumbLink.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import AcademyProgramForm from '$lib/components/academy-program-form/AcademyProgramForm.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import { addChinesePadding } from '$lib/utils/stringUtils.js';

	export let data;

	let programModal = false;
	let programDeleteModal = false;

	// TODO let user with staff status override this
	$: canDelete = !data.program.students.length;
</script>

<Heading tag="h1" class="alt-page-title flex">
	<span>CF Academy |&nbsp;</span>
	<AcademyProgramItem program={data.program} gap="gap-2" />
</Heading>

<Hr />

<article>
	<Breadcrumb>
		<BreadcrumbLink text="CF Academy" href="/cf-academy" />
		<BreadcrumbItem>
			<AcademyProgramItem program={data.program} />
		</BreadcrumbItem>
	</Breadcrumb>

	<div class="flex gap-2 mt-8">
		<Button outline on:click={() => (programModal = true)}>Update</Button>

		<Button outline color="light" on:click={() => (programDeleteModal = true)} disabled={!canDelete}
			>Delete</Button
		>
		{#if !canDelete}
			<Tooltip class="tooltip max-w-sm" placement="right-end">
				You cannot delete this Academy program because it already has at least one participant.
			</Tooltip>
		{/if}
	</div>
</article>

<article class="mt-12">
	<Heading tag="h2" class="section-title">Participants</Heading>

	{#if data.program.students.length}
		<div class="flex flex-col gap-3 mt-6 text-sm">
			{#each data.program.students as student}
				<LinkWithIcon text={student.fullname} href={`/student/${student.id}`} iconFirst={true} />
			{/each}
		</div>
	{:else}
		<NoDataSign text="None" divClass="mt-6" />
	{/if}
</article>

<FormModal
	open={programModal}
	superform={data.programForm}
	fields={AcademyProgramForm}
	entity={data.program}
	title="Update Academy program"
	action="?/updateAcademyProgram"
	extra={[{ type: 'text', name: 'category', value: data.program.category }]}
	on:close={() => (programModal = false)}
/>

<FormModal
	open={programDeleteModal}
	superform={data.deleteForm}
	fields={DeleteForm}
	entity={data.program}
	title="Delete Academy program"
	action="?/deleteAcademyProgram"
	on:close={() => (programDeleteModal = false)}
>
	<DeleteMessage
		slot="preface"
		name={`this CF Academy program/club (${addChinesePadding(data.program.name)}), including the associated participation records, if any,`}
	/>
</FormModal>
