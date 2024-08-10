<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Heading, Hr } from 'flowbite-svelte';

	import SchoolForm from '$lib/components/school-form/SchoolForm.svelte';

	export let data;

	const { form, message, errors, enhance } = superForm(data.schoolForm);
</script>

<Heading tag="h3" class="page-title">Create a school file</Heading>

<Hr />

<div class="form-width">
	<form method="post" action="?/createSchool" use:enhance>
		<SchoolForm {form} {message} {errors} />
	</form>
</div>
