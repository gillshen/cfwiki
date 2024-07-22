<script lang="ts">
	import { Textarea, Label, P } from 'flowbite-svelte';

	export let form: any;
</script>

<P size="base">Anything special you want to note about the student?</P>

<div>
	<Label for="comments" class="form-label optional">Comments</Label>
	<Textarea id="comments" name="comments" bind:value={$form.comments} rows="6" />
</div>
