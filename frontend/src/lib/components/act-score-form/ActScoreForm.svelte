<script lang="ts">
	import { Label, Button, Input } from 'flowbite-svelte';
	import type { ActScore } from '$lib/api/scores';

	export let form: any;
	export let score: ActScore | null = null;

	$form.id = score?.id;
	$form.student = score?.student;
	$form.date = score?.date;
	$form.english = score?.english;
	$form.math = score?.math;
	$form.reading = score?.reading;
	$form.science = score?.science;
	$form.writing = score?.writing;
</script>

<input type="number" name="id" class="hidden" bind:value={$form.id} />

<div class="grid grid-cols-2 gap-x-8">
	<div>
		<Label for="date" class="form-label optional">Date</Label>
		<Input id="date" type="date" name="date" bind:value={$form.date} />
	</div>
	<div></div>

	<div>
		<Label for="math" class="form-label optional">Math</Label>
		<Input id="math" type="number" name="math" min="1" max="36" bind:value={$form.math} />
	</div>
	<div>
		<Label for="science" class="form-label optional">Science</Label>
		<Input id="science" type="number" name="science" min="1" max="36" bind:value={$form.science} />
	</div>

	<div>
		<Label for="english" class="form-label optional">English</Label>
		<Input id="english" type="number" name="english" min="1" max="36" bind:value={$form.english} />
	</div>
	<div>
		<Label for="reading" class="form-label optional">Reading</Label>
		<Input id="reading" type="number" name="reading" min="1" max="36" bind:value={$form.reading} />
	</div>

	<div>
		<Label for="writing" class="form-label optional">Writing</Label>
		<Input id="writing" type="number" name="writing" min="2" max="12" bind:value={$form.writing} />
	</div>
</div>

<Button type="submit" class="mt-8">{score ? 'Update' : 'Submit'}</Button>
