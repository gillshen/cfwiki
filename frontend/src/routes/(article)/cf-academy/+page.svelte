<script lang="ts">
	import { Button, Heading, Hr } from 'flowbite-svelte';

	import AcademyProgramItems from '$lib/components/list-items/AcademyProgramItems.svelte';
	import AcademyProgramForm from '$lib/components/academy-program-form/AcademyProgramForm.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';

	export let data;

	let programModal = false;
	let clubModal = false;
</script>

<Heading tag="h1" class="page-title">CF Academy</Heading>

<Hr />

{#await data.programs}
	<FetchingDataSign />
{:then programs}
	<Heading tag="h2" class="section-title">Programs</Heading>

	<div class="grid grid-cols-4 gap-y-3 gap-x-6 mt-6 text-sm">
		<AcademyProgramItems programs={programs.filter((p) => !p.category)} />
	</div>

	<Button outline class="w-fit mt-8" on:click={() => (programModal = true)}>
		Create a program
	</Button>

	<Heading tag="h2" class="section-title mt-12">Clubs</Heading>

	<div class="grid grid-cols-4 gap-y-3 gap-x-6 mt-6 text-sm">
		<AcademyProgramItems programs={programs.filter((p) => p.category === 'club')} />
	</div>

	<Button outline class="w-fit mt-8" on:click={() => (clubModal = true)}>Create a club</Button>
{/await}

<FormModal
	open={programModal}
	superform={data.programForm}
	fields={AcademyProgramForm}
	action="?/createAcademyProgram"
	title="Create an Academy program"
	on:close={() => (programModal = false)}
/>

<FormModal
	open={clubModal}
	superform={data.programForm}
	fields={AcademyProgramForm}
	action="?/createAcademyProgram"
	title="Create an Academy club"
	extra={[{ name: 'category', type: 'text', value: 'club' }]}
	on:close={() => (clubModal = false)}
/>
