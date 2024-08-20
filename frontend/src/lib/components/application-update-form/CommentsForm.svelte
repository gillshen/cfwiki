<script lang="ts">
	import { Label, Textarea, Button } from 'flowbite-svelte';
	import type { ApplicationDetail } from '$lib/api/application';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: ApplicationDetail;

	// TODO
	if ($message || $errors) {
		//
	}

	$form.id = entity.id;
	$form.comments = entity.comments;
</script>

<input type="number" name="id" class="hidden" bind:value={$form.id} />

<Label for="comments" class="form-label optional">Comments</Label>
<Textarea id="comments" name="comments" rows="4" maxlength="1000" bind:value={$form.comments} />

<Button type="submit" class="mt-8">Update</Button>
