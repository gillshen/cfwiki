<script lang="ts">
	import { Button } from 'flowbite-svelte';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: { id: number };

	// TODO
	if ($message || $errors) {
		//
	}

	$form.id = entity.id;
</script>

<input type="number" name="id" class="hidden" bind:value={$form.id} />

<Button class="mt-8 bg-red-700 hover:bg-red-600" type="submit">Yes, delete this</Button>
