<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import Pencil from 'lucide-svelte/icons/pencil';
	import X from 'lucide-svelte/icons/x';

	import type { ApplicationLog } from '$lib/api/applicationLog';
	import type { ApplicationLogSchema } from '$lib/schemas/applicationLog';
	import type { DeleteSchema } from '$lib/schemas/delete';
	import type { ApplicationDetail } from '$lib/api/application';
	import ApplicationLogForm from '$lib/components/forms/ApplicationLogForm.svelte';
	import DeleteForm from '$lib/components/forms/DeleteForm.svelte';
	import PrimitiveItem from './PrimitiveItem.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';

	export let log: ApplicationLog;
	export let application: ApplicationDetail;
	export let canEdit: boolean = false;
	export let updateForm: SuperValidated<Infer<ApplicationLogSchema>>;
	export let deleteForm: SuperValidated<Infer<DeleteSchema>>;

	const form = superForm(updateForm, {
		id: `log-form-${log.id}`,
		resetForm: false,
		onUpdated({ form }) {
			if (form.valid) {
				updateModal = false;
			}
		}
	});
	const { form: formData, enhance } = form;
	$formData = { ...log, application: application.id };

	let updateModal = false;
	let deleteModal = false;
</script>

{#if canEdit}
	<PrimitiveItem {log}>
		<div slot="buttons">
			<div class="flex items-center space-x-2 ml-2">
				<ButtonDialog buttonSlot dialogTitle="Edit Application Status" bind:open={updateModal}>
					<Pencil class="size-3 text-muted-foreground hover:text-mint-600" slot="button" />
					<form
						method="POST"
						action="?/createOrUpdateApplicationLog"
						class="max-w-prose space-y-4 my-4 mx-auto"
						use:enhance
						id="log-form-{log.id}"
					>
						<ApplicationLogForm {form} {application} />
					</form>
				</ButtonDialog>

				<ButtonDialog
					buttonSlot
					dialogTitle="Delete this application status?"
					bind:open={deleteModal}
				>
					<X class="size-3 text-muted-foreground hover:text-mint-600" slot="button" />
					<p slot="description">Deletion is instant and permanent.</p>
					<DeleteForm
						data={deleteForm}
						objectId={log.id}
						action="?/deleteApplicationLog"
						onUpdated={({ form }) => form.valid && (deleteModal = false)}
						onCancel={() => (deleteModal = false)}
					/>
				</ButtonDialog>
			</div>
		</div>
	</PrimitiveItem>
{:else}
	<PrimitiveItem {log} />
{/if}
