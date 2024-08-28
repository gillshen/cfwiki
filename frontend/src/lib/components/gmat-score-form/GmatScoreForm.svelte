<script lang="ts">
	import { Label, Input, Button, Checkbox } from 'flowbite-svelte';

	import type { GmatScore } from '$lib/api/scores';

	export let form: any;
	export let message: any;
	export let errors: any;
	export let entity: GmatScore | null = null;

	$form.id = entity?.id;
	$form.date = entity?.date;
	$form.total = entity?.total;
	$form.verbal = entity?.verbal;
	$form.quant = entity?.quant;
	$form.data_insights = entity?.data_insights;
	$form.reasoning = entity?.reasoning;
	$form.writing = entity?.writing;
	$form.is_legacy = entity?.is_legacy;

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
		<Label for="total" class="form-label optional">Total</Label>
		<Input
			id="total"
			type="number"
			name="total"
			min="200"
			max="805"
			step="5"
			bind:value={$form.total}
		/>
	</div>
	<div></div>

	<Checkbox
		class="font-normal mt-8 mb-4 col-span-2"
		name="is_legacy"
		bind:checked={$form.is_legacy}
	>
		This is the old, pre-2023 version of GMAT
	</Checkbox>

	<div>
		<Label for="verbal" class="form-label optional">Verbal</Label>
		<Input
			id="verbal"
			type="number"
			name="verbal"
			min={$form.is_legacy ? 0 : 60}
			max={$form.is_legacy ? 60 : 90}
			bind:value={$form.verbal}
		/>
	</div>
	<div>
		<Label for="quant" class="form-label optional">Quantitative</Label>
		<Input
			id="quant"
			type="number"
			name="quant"
			min={$form.is_legacy ? 0 : 60}
			max={$form.is_legacy ? 60 : 90}
			bind:value={$form.quant}
		/>
	</div>

	{#if $form.is_legacy}
		<div>
			<Label for="reasoning" class="form-label optional">Integrated Reasoning</Label>
			<Input
				id="reasoning"
				type="number"
				name="reasoning"
				min="1"
				max="8"
				bind:value={$form.reasoning}
			/>
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
	{:else}
		<div>
			<Label for="data-insights" class="form-label optional">Data Insights</Label>
			<Input
				id="data-insights"
				type="number"
				name="data_insights"
				min="60"
				max="90"
				bind:value={$form.data_insights}
			/>
		</div>
	{/if}
</div>

<Button type="submit" class="mt-8">Submit</Button>
