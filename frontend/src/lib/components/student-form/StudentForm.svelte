<script lang="ts">
	import { Button, Hr } from 'flowbite-svelte';

	import NameFields from '$lib/components/student-form/NameFields.svelte';
	import BirthFields from '$lib/components/student-form/BirthFields.svelte';
	import LocationFields from '$lib/components/student-form/LocationFields.svelte';
	import CommentsField from '$lib/components/student-form/CommentsField.svelte';

	export let form: any;
	export let submitButtonText = 'Submit';
</script>

<NameFields {form} />
<Hr />
<BirthFields {form} />
<Hr />
<LocationFields {form} />
<Hr />
<CommentsField {form} />
<Hr />
<Button type="submit">{submitButtonText}</Button>
