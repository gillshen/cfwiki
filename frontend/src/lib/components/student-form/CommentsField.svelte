<script lang="ts">
	import { Textarea, Label } from 'flowbite-svelte';

	export let form: any;
</script>

<Label for="comments" class="form-label optional-cap">
	Anything special you want to note about the student?
</Label>
<Textarea id="comments" name="comments" maxlength="5000" bind:value={$form.comments} rows="6" />
