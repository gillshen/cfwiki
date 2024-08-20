<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Heading, Hr, Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

	import RoundForm from '$lib/components/application-round-form/RoundForm.svelte';

	export let data;

	const { form, message, errors, enhance } = superForm(data.roundForm);
</script>

<Heading tag="h3" class="page-title">Create an application round</Heading>

<Hr />

<div class="w-[30rem]">
	<Table noborder>
		<TableBody>
			<TableBodyRow>
				<TableBodyCell tdClass="w-32 font-medium py-3 align-top">
					{data.program.schools.length > 1 ? 'Schools' : 'School'}
				</TableBodyCell>
				<TableBodyCell tdClass="font-normal">
					<div class="flex gap-2">
						{#each data.program.schools as school}
							<div>{school.name}</div>
						{/each}
					</div>
				</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-32 font-medium py-3">Program</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{data.program.display_name}</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-32 font-medium py-3">Cycle</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{data.term} {data.year}</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>

	<Hr />

	<form method="post" action="?/createApplicationRound" use:enhance>
		<input type="number" name="program" value={data.program.id} class="hidden" />
		<input type="number" name="year" value={data.year} class="hidden" />
		<input type="text" name="term" value={data.term} class="hidden" />

		<RoundForm {form} {message} {errors} />
	</form>
</div>
