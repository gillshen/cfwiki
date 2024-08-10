<script lang="ts">
	import { Label, Button, Input } from 'flowbite-svelte';
	import type { DuolingoScore } from '$lib/api/scores';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: DuolingoScore | null = null;

	$form.id = entity?.id;
	$form.student = entity?.student;
	$form.date = entity?.date;
	$form.literacy = entity?.literacy;
	$form.comprehension = entity?.comprehension;
	$form.conversation = entity?.conversation;
	$form.production = entity?.production;
	$form.overall = entity?.overall;

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
		<Label for="overall" class="form-label optional">Overall</Label>
		<Input
			id="overall"
			type="number"
			name="overall"
			min="10"
			max="160"
			step="5"
			bind:value={$form.overall}
		/>
	</div>
	<div></div>

	<div>
		<Label for="literacy" class="form-label optional">Literacy</Label>
		<Input
			id="literacy"
			type="number"
			name="literacy"
			min="10"
			max="160"
			step="5"
			bind:value={$form.literacy}
		/>
	</div>
	<div>
		<Label for="comprehension" class="form-label optional">Comprehension</Label>
		<Input
			id="comprehension"
			type="number"
			name="comprehension"
			min="10"
			max="160"
			step="5"
			bind:value={$form.comprehension}
		/>
	</div>

	<div>
		<Label for="conversation" class="form-label optional">Conversation</Label>
		<Input
			id="conversation"
			type="number"
			name="conversation"
			min="10"
			max="160"
			step="5"
			bind:value={$form.conversation}
		/>
	</div>
	<div>
		<Label for="production" class="form-label optional">Production</Label>
		<Input
			id="production"
			type="number"
			name="production"
			min="10"
			max="160"
			step="5"
			bind:value={$form.production}
		/>
	</div>
</div>

<Button type="submit" class="mt-8">{entity ? 'Update' : 'Submit'}</Button>
