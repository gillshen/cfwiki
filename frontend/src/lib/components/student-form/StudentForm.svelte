<script lang="ts">
	import { Button, Hr } from 'flowbite-svelte';

	import NameFields from '$lib/components/student-form/NameFields.svelte';
	import BirthFields from '$lib/components/student-form/BirthFields.svelte';
	import LocationFields from '$lib/components/student-form/LocationFields.svelte';
	import CommentsField from '$lib/components/student-form/CommentsField.svelte';

	export let form: any;
	export let submitButtonText = 'Submit';
</script>

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
<div class="w-[40rem] px-8">
	<CommentsField {form} />
</div>
<Hr />
<div class="w-[30rem] px-8">
	<Button type="submit">{submitButtonText}</Button>
</div>
