<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import DatesFields from '$lib/components/application-round-form/DatesFields.svelte';

	export let form: any;
</script>

<DatesFields {form} />

<Button type="submit" class="mt-8">Update</Button>
