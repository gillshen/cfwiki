<script lang="ts">
	import { Heading, Hr } from 'flowbite-svelte';
	import ProgramCollectionForm from '$lib/components/program-collection-form/ProgramCollectionForm.svelte';

	export let data;
</script>

<Heading tag="h2" class="page-title">Update collection</Heading>

<Hr />

<ProgramCollectionForm
	schools={data.schools}
	programs={data.programs}
	collectionForm={data.collectionForm}
	userId={data.userId}
	action="?/updateProgramCollection"
/>
