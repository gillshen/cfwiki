<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import FormButton from '$lib/components/ui/form/form-button.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Pencil from 'lucide-svelte/icons/pencil';
	import X from 'lucide-svelte/icons/x';

	import type { ApplicationLog } from '$lib/api/applicationLog';
	import type { ApplicationLogSchema } from '$lib/schemas/applicationLog';
	import type { DeleteSchema } from '$lib/schemas/delete';
	import type { ApplicationDetail } from '$lib/api/application';
	import ApplicationLogForm from '$lib/components/forms/ApplicationLogForm.svelte';
	import PrimitiveItem from './PrimitiveItem.svelte';

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
			<Badge variant="secondary" class="text-muted-foreground flex items-center space-x-2">
				<Dialog.Root bind:open={updateDialogOpen}>
					<Dialog.Trigger>
						<Pencil class="size-3 text-secondary-foreground hover:text-secondary-foreground/80" />
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Edit Application Status</Dialog.Title>
						</Dialog.Header>
						<form
							method="POST"
							action="?/createOrUpdateApplicationLog"
							class="max-w-prose space-y-4 my-4 mx-auto"
							use:enhance
							id="log-form-{log.id}"
						>
							<ApplicationLogForm {form} {application} />
						</form>
						<!-- <SuperDebug data={$formData} /> -->
					</Dialog.Content>
				</Dialog.Root>

				<Separator orientation="vertical" class="h-3" />

				<Dialog.Root bind:open={deleteDialogOpen}>
					<Dialog.Trigger>
						<!-- <Badge variant="outline"> -->
						<X class="size-3 text-secondary-foreground hover:text-rose-700" />
						<!-- </Badge> -->
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Delete this application status?</Dialog.Title>
							<Dialog.Description>This action cannot be undone.</Dialog.Description>
						</Dialog.Header>
						<form
							method="POST"
							action="?/deleteApplicationLog"
							class="max-w-prose space-y-4 pb-2"
							use:delEnhance
							id="log-delete-form-{log.id}"
						>
							<input type="number" name="id" bind:value={$delFormData.id} hidden />
							<FormButton variant="destructive">Delete</FormButton>
							<Button variant="ghost" class="mr-4" on:click={() => (deleteDialogOpen = false)}
								>Cancel</Button
							>
						</form>
					</Dialog.Content>
				</Dialog.Root>
			</Badge>
		</div>
	</PrimitiveItem>
{:else}
	<PrimitiveItem {log} />
{/if}
