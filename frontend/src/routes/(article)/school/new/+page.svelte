<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Heading, Hr } from 'flowbite-svelte';

	import SchoolForm from '$lib/components/school-form/SchoolForm.svelte';
	import Toast from '$lib/components/misc/Toast.svelte';

	export let data;

	const { form, message, errors, enhance } = superForm(data.schoolForm, {
		onUpdated({ form }) {
			if (!form.valid) {
				showToast = true;
			}
		}
	});

	let showToast = false;
</script>

<Heading tag="h3" class="page-title">Create a school file</Heading>

<Hr />

<div class="form-width">
	<form method="post" action="?/createSchool" use:enhance>
		<SchoolForm {form} {message} {errors} />
	</form>
</div>

{#if showToast}
	<Toast type="error" onClose={() => (showToast = false)}>
		Operation failed. Possibly because this school already exists.
	</Toast>
{/if}
