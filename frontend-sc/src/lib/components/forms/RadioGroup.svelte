<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import * as RadioGroup from '$lib/components/ui/radio-group/index';

	import type { SuperForm } from 'sveltekit-superforms';

	export let form: SuperForm<any>;
	export let name: string;
	export let label: string;
	export let items: { label: string; value: any }[];

	const { form: formData } = form;
</script>

<Form.Fieldset {form} {name}>
	<Form.Legend class="pb-1">{label}</Form.Legend>
	<Form.Control>
		<RadioGroup.Root bind:value={$formData[name]}>
			{#each items as item}
				<div class="flex items-center space-x-3">
					<Form.Control let:attrs>
						<RadioGroup.Item value={item.value} {...attrs} />
						<Form.Label class="font-normal">{item.label}</Form.Label>
					</Form.Control>
				</div>
			{/each}
			<RadioGroup.Input {name} />
		</RadioGroup.Root>
	</Form.Control>
	<Form.FieldErrors />
</Form.Fieldset>
