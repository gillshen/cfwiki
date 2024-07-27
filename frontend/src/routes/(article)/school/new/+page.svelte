<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Heading, Hr } from 'flowbite-svelte';

	import SchoolForm from '$lib/components/school-form/SchoolForm.svelte';

	export let data;

	const { form, enhance } = superForm(data.newSchoolForm);
</script>

<div class="px-24 py-16 w-min">
	<Heading tag="h2" class="pt-12 px-8">Create a school file</Heading>

	<Hr />

	<form method="post" action="?/createSchool" use:enhance class="w-auto">
		<SchoolForm {form} />
	</form>
</div>
