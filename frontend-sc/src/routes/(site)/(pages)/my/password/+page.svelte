<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as Alert from '$lib/components/ui/alert';
	import Input from '$lib/components/ui/input/input.svelte';
	import ShieldAlert from 'lucide-svelte/icons/shield-alert';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import FormField from '$lib/components/ui/form/form-field.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import * as Checklist from '$lib/components/widgets/checklist/index';
	import { createTitle } from '$lib/util/siteUtils';

	import {
		passwordHasUsername,
		passwordLongEnough,
		passwordHasUpper,
		passwordHasLower,
		passwordHasDigitOrSpecial
	} from '$lib/util/userUtils';

	export let data;

	const form = superForm(data.passwordResetForm, { invalidateAll: 'force' });
	const { form: formData, enhance } = form;
</script>

<svelte:head>
	<title>{createTitle('Change Password')}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Page>Password</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<h1 class="page-title mb-2">Change Password</h1>

<Section id="password-section">
	<Alert.Root class="mt-6 mb-8 w-fit pr-6 max-w-prose">
		<ShieldAlert class="size-4" />
		<Alert.Title>Heads up!</Alert.Title>
		<Alert.Description>
			After changing the password, you will be logged out immediately.
		</Alert.Description>
	</Alert.Root>

	<form
		method="POST"
		action="?/updatePassword"
		class="max-w-prose space-y-6"
		id="password-form"
		use:enhance
	>
		<input name="id" bind:value={data.user.id} hidden />

		<FormField {form} name="current_password">
			<Form.Control let:attrs>
				<Form.Label>Current password</Form.Label>
				<Input
					type="password"
					class="w-[360px]"
					maxlength={50}
					{...attrs}
					bind:value={$formData.current_password}
				/>
				<Form.FieldErrors />
			</Form.Control>
		</FormField>

		<FormField {form} name="new_password">
			<Form.Control let:attrs>
				<Form.Label>New password</Form.Label>
				<Input
					type="password"
					class="w-[360px]"
					maxlength={50}
					{...attrs}
					bind:value={$formData.new_password}
				/>
				<Form.Description>
					<Checklist.Root class="pt-1 gap-1">
						<Checklist.Item
							text="Different from your current password"
							checked={$formData.new_password
								? $formData.new_password !== $formData.current_password
								: null}
						/>
						<Checklist.Item
							text="Does not contain your username"
							checked={$formData.new_password
								? !passwordHasUsername($formData.new_password, data.user.username)
								: null}
						/>
						<Checklist.Item
							text="At least 8 characters"
							checked={$formData.new_password ? passwordLongEnough($formData.new_password) : null}
						/>
						<Checklist.Item
							text="Contains at least 1 uppercase letter"
							checked={$formData.new_password ? passwordHasUpper($formData.new_password) : null}
						/>
						<Checklist.Item
							text="Contains at least 1 lowercase letter"
							checked={$formData.new_password ? passwordHasLower($formData.new_password) : null}
						/>
						<Checklist.Item
							text="Contains at least 1 digit or special character"
							checked={$formData.new_password
								? passwordHasDigitOrSpecial($formData.new_password)
								: null}
						/>
					</Checklist.Root>
				</Form.Description>
				<Form.FieldErrors />
			</Form.Control>
		</FormField>

		<FormField {form} name="confirm_new_password">
			<Form.Control let:attrs>
				<Form.Label>Confirm new password</Form.Label>
				<Input
					type="password"
					class="w-[360px]"
					maxlength={50}
					{...attrs}
					bind:value={$formData.confirm_new_password}
				/>
				<Form.Description>
					<Checklist.Root class="pt-1 gap-1">
						<Checklist.Item
							text="Matches the new passowrd"
							checked={$formData.confirm_new_password
								? $formData.new_password === $formData.confirm_new_password
								: null}
						/>
					</Checklist.Root>
				</Form.Description>
				<Form.FieldErrors />
			</Form.Control>
		</FormField>

		<Form.Button class="w-fit min-w-24">Submit</Form.Button>
		<!-- <SuperDebug data={$formData} /> -->
	</form>
</Section>
