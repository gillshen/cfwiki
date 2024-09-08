<script lang="ts">
	import { Button, Hr, P } from 'flowbite-svelte';

	import NameFields from '$lib/components/student-form/NameFields.svelte';
	import BirthFields from '$lib/components/student-form/BirthFields.svelte';
	import LocationFields from '$lib/components/location-fields/LocationFields.svelte';
	import CommentsField from '$lib/components/student-form/CommentsField.svelte';

	export let form: any;
	export let submitButtonText = 'Submit';
</script>

<NameFields {form} />
<Hr />
<BirthFields {form} />
<Hr />
<P size="sm" class="font-medium">Where is the student from?</P>
<LocationFields
	{form}
	countryFieldName="base_country"
	regionFieldName="base_subnational"
	cityFieldName="base_city"
/>
<Hr />
<CommentsField {form} />

<Button type="submit" class="mt-8">{submitButtonText}</Button>
