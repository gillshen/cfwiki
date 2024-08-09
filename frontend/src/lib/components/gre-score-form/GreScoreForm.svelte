<script lang="ts">
	import { Label, Input, Button } from 'flowbite-svelte';

	import type { GreScore } from '$lib/api/scores';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: GreScore | null = null;

	$form.id = entity?.id;
	$form.date = entity?.date;
	$form.verbal = entity?.verbal;
	$form.quant = entity?.quant;
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
		<Label for="verbal" class="form-label optional">Verbal</Label>
		<Input id="verbal" type="number" name="verbal" min="130" max="170" bind:value={$form.verbal} />
	</div>
	<div>
		<Label for="quant" class="form-label optional">Quantitative</Label>
		<Input id="quant" type="number" name="quant" min="130" max="170" bind:value={$form.quant} />
	</div>

	<div>
		<Label for="writing" class="form-label optional">Writing</Label>
		<Input
			id="writing"
			type="number"
			name="writing"
			min="0"
			max="6"
			step="0.5"
			bind:value={$form.writing}
		/>
	</div>
</div>

<Button type="submit" class="mt-8">Submit</Button>
