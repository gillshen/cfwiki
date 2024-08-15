<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Timeline, Button } from 'flowbite-svelte';

	import type { ApplicationDetail } from '$lib/api/application';
	import type { ApplicationLog } from '$lib/api/applicationLog';
	import ApplicationLogItem from '$lib/components/list-items/ApplicationLogItem.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import ApplicationLogForm from '$lib/components/application-log-form/ApplicationLogForm.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';

	export let application: ApplicationDetail;
	export let form: SuperValidated<any>;
	export let deleteForm: SuperValidated<any>;
	export let canEdit: boolean = false;

	let logModal = false;
	let logDeleteModal = false;
	let activeLog: ApplicationLog | null = null;

	const logModalOpener = (log?: ApplicationLog): (() => void) => {
		return () => {
			activeLog = log ?? null;
			logModal = true;
		};
	};

	$: logs = application.logs.sort((a: ApplicationLog, b: ApplicationLog) => {
		if (a.date !== b.date) {
			return a.date.localeCompare(b.date);
		} else {
			return a.updated.localeCompare(b.updated);
		}
	});
</script>

<article class="w-full h-fit bg-slate-50 rounded-xl px-8 py-4">
	{#if logs.length}
		<Timeline class="ml-2 mt-4">
			{#each logs as log}
				<ApplicationLogItem {log}>
					{#if canEdit}
						<div class="mt-2">
							<UpdateDeleteButton
								updateAction={logModalOpener(log)}
								deleteAction={() => {
									activeLog = log;
									logDeleteModal = true;
								}}
							/>
						</div>
					{/if}
				</ApplicationLogItem>
			{/each}
		</Timeline>
	{/if}
	{#if canEdit}
		<Button outline class="ml-2 my-2" on:click={logModalOpener()}>Add a status</Button>
	{/if}
	{#if !canEdit && !logs.length}
		<NoDataSign text="No application status reported" divClass="ml-2 my-2" />
	{/if}
</article>

<FormModal
	open={logModal}
	superform={form}
	fields={ApplicationLogForm}
	action={`/application/${application.id}?/createOrUpdateApplicationLog`}
	entity={activeLog}
	extra={[{ name: 'application', type: 'number', value: application.id }]}
	title={`${activeLog ? 'Update' : 'Add an'} application status`}
	on:close={() => (logModal = false)}
/>

<FormModal
	open={logDeleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	action={`/application/${application.id}?/deleteApplicationLog`}
	entity={activeLog}
	title="Delete application status"
	on:close={() => (logDeleteModal = false)}
>
	<DeleteMessage slot="preface" name={`this application status (${activeLog?.status})`} />
</FormModal>
