<script lang="ts">
	import { Label, Input, Textarea, Button } from 'flowbite-svelte';
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
	$form.major_1 = entity.major_1;
	$form.major_2 = entity.major_2;
	$form.major_3 = entity.major_3;
	$form.comments = entity.comments;
</script>

<input type="number" name="id" class="hidden" bind:value={$form.id} />

<Label for="major-1" class="form-label optional">Major 1</Label>
<Input id="major-1" type="text" name="major_1" maxlength="100" bind:value={$form.major_1} />

<Label for="major-2" class="form-label optional">Major 2</Label>
<Input id="major-2" type="text" name="major_2" maxlength="100" bind:value={$form.major_2} />

<Label for="major-3" class="form-label optional">Major 3</Label>
<Input id="major-3" type="text" name="major_3" maxlength="100" bind:value={$form.major_3} />

<Label for="comments" class="form-label optional">Comments</Label>
<Textarea id="comments" name="comments" rows="4" maxlength="1000" bind:value={$form.comments} />

<Button type="submit" class="mt-8">Update</Button>
