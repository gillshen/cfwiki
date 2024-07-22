<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Button, Heading, Hr } from 'flowbite-svelte';

	import NameFields from '$lib/components/student-form/NameFields.svelte';
	import BirthFields from '$lib/components/student-form/BirthFields.svelte';
	import LocationFields from '$lib/components/student-form/LocationFields.svelte';

	export let data;

	const { form, enhance } = superForm(data.newStudentForm);
</script>

<div class="p-24 w-min">
	<Heading tag="h2" class="px-8">Create a student file</Heading>

	<Hr />

	<form method="post" action="?/createStudent" use:enhance class="w-auto">
		<div class="w-[30rem] px-8">
			<NameFields {form} />
		</div>
		<Hr />
		<div class="w-[30rem] px-8">
			<BirthFields {form} />
		</div>
		<Hr />
		<div class="w-[30rem] px-8">
			<LocationFields {form} />
		</div>
		<Hr />
		<div class="w-[30rem] px-8">
			<Button type="submit">Submit</Button>
		</div>
	</form>
</div>
