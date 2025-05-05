<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import FormButton from '$lib/components/ui/form/form-button.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Pencil from 'lucide-svelte/icons/pencil';
	import X from 'lucide-svelte/icons/x';

	import type { ApplicationLog } from '$lib/api/applicationLog';
	import type { ApplicationLogSchema } from '$lib/schemas/applicationLog';
	import type { DeleteSchema } from '$lib/schemas/delete';
	import type { ApplicationDetail } from '$lib/api/application';
	import ApplicationLogForm from '$lib/components/forms/ApplicationLogForm.svelte';
	import PrimitiveItem from './PrimitiveItem.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';

	export let log: ApplicationLog;
	export let application: ApplicationDetail;
	export let canEdit: boolean = false;
	export let updateForm: SuperValidated<Infer<ApplicationLogSchema>>;
	export let deleteForm: SuperValidated<Infer<DeleteSchema>>;

	const form = superForm(updateForm, {
		id: `log-form-${log.id}`,
		onUpdated({ form }) {
			if (form.valid) {
				// repopulate form data
				$formData = { ...log, application: application.id };
				updateDialogOpen = false;
			}
		}
	});
	const { form: formData, enhance } = form;

	const delForm = superForm(deleteForm, {
		id: `log-delete-form-${log.id}`,
		onUpdated({ form }) {
			if (form.valid) {
				deleteDialogOpen = false;
			}
		}
	});
	const { form: delFormData, enhance: delEnhance } = delForm;

	let updateDialogOpen = false;
	let deleteDialogOpen = false;

	$formData = { ...log, application: application.id };
	$delFormData.id = log.id;
</script>

{#if canEdit}
	<PrimitiveItem {log}>
		<div slot="buttons">
			<div class="flex items-center space-x-2 ml-2">
				<ButtonDialog buttonSlot dialogTitle="Edit Application Status" bind:open={updateDialogOpen}>
					<Pencil
						class="size-3 text-muted-foreground hover:text-secondary-foreground/80"
						slot="button"
					/>
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
					bind:open={deleteDialogOpen}
				>
					<X
						class="size-3 text-muted-foreground hover:text-secondary-foreground/80"
						slot="button"
					/>
					<p slot="description">This action cannot be undone.</p>
					<form
						method="POST"
						action="?/deleteApplicationLog"
						class="max-w-prose space-y-4 pb-2"
						use:delEnhance
						id="log-delete-form-{log.id}"
					>
						<input type="number" name="id" bind:value={$delFormData.id} hidden />

						<div class="mx-auto mt-4 w-fit">
							<FormButton variant="destructive">Delete</FormButton>
							<Button variant="ghost" on:click={() => (deleteDialogOpen = false)}>Cancel</Button>
						</div>
					</form>
				</ButtonDialog>
			</div>
		</div>
	</PrimitiveItem>
{:else}
	<PrimitiveItem {log} />
{/if}
