<script lang="ts">
	import { Label, Button, Input } from 'flowbite-svelte';
	import type { ToeflScore } from '$lib/api/scores';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: ToeflScore | null = null;

	$form.id = entity?.id;
	$form.student = entity?.student;
	$form.date = entity?.date;
	$form.reading = entity?.reading;
	$form.listening = entity?.listening;
	$form.speaking = entity?.speaking;
	$form.writing = entity?.writing;

	// TODO
	if ($message || $errors) {
		//
	}
</script>

<input type="number" name="id" class="hidden" bind:value={$form.id} />

<div class="grid grid-cols-2 gap-x-8">
	<div>
		<Label for="date" class="form-label optional">Date</Label>
		<Input id="date" type="date" name="date" bind:value={$form.date} />
	</div>
	<div></div>

	<div>
		<Label for="reading" class="form-label optional">Reading</Label>
		<Input id="reading" type="number" name="reading" min="0" max="30" bind:value={$form.reading} />
	</div>
	<div>
		<Label for="listening" class="form-label optional">Listening</Label>
		<Input
			id="listening"
			type="number"
			name="listening"
			min="0"
			max="30"
			bind:value={$form.listening}
		/>
	</div>

	<div>
		<Label for="speaking" class="form-label optional">Speaking</Label>
		<Input
			id="speaking"
			type="number"
			name="speaking"
			min="0"
			max="30"
			bind:value={$form.speaking}
		/>
	</div>
	<div>
		<Label for="writing" class="form-label optional">Writing</Label>
		<Input id="writing" type="number" name="writing" min="0" max="30" bind:value={$form.writing} />
	</div>
</div>

<Button type="submit" class="mt-8">{entity ? 'Update' : 'Submit'}</Button>
