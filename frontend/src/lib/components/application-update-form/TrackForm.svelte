<script lang="ts">
	import { Label, Input, Button, Helper } from 'flowbite-svelte';
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
	$form.track = entity.track;
</script>

<input type="number" name="id" class="hidden" bind:value={$form.id} />

<Label for="track" class="form-label optional">Track, concentration, or pathway</Label>
<Input id="track" type="text" name="track" maxlength="100" bind:value={$form.track} />
<Helper class="mt-2 form-helper">
	For consistency and brevity, do not include the word &ldquo;track&rdquo; or its equivalent. Also
	omit the leading &ldquo;the&rdquo;, if any. E.g., &ldquo;Early-career&rdquo;, not &ldquo;The
	Early-career Track&rdquo;.
</Helper>

<Button type="submit" class="mt-8">Update</Button>
