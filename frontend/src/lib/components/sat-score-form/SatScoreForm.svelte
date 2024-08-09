<script lang="ts">
	import { Label, Button, Input } from 'flowbite-svelte';
	import type { SatScore } from '$lib/api/scores';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: SatScore | null = null;

	$form.id = entity?.id;
	$form.student = entity?.student;
	$form.date = entity?.date;
	$form.ebrw = entity?.ebrw;
	$form.math = entity?.math;
	$form.essay = entity?.essay;

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
		<Label for="ebrw" class="form-label optional">EBRW</Label>
		<Input
			id="ebrw"
			type="number"
			name="ebrw"
			min="200"
			max="800"
			step="10"
			bind:value={$form.ebrw}
		/>
	</div>
	<div>
		<Label for="math" class="form-label optional">Math</Label>
		<Input
			id="math"
			type="number"
			name="math"
			min="200"
			max="800"
			step="10"
			bind:value={$form.math}
		/>
	</div>

	<div>
		<Label for="essay" class="form-label optional">Essay</Label>
		<Input id="essay" type="number" name="essay" min="2" max="8" bind:value={$form.essay} />
	</div>
</div>

<Button type="submit" class="mt-8">{entity ? 'Update' : 'Submit'}</Button>
