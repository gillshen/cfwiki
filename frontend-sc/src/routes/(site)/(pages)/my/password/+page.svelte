<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as Alert from '$lib/components/ui/alert';
	import ShieldAlert from 'lucide-svelte/icons/shield-alert';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import * as Checklist from '$lib/components/widgets/checklist/index';
	import { createTitle } from '$lib/util/siteUtils';

	import {
		has8Chars,
		hasLowercase,
		hasUppercase,
		hasDigitOrSpecial,
		noUsername
	} from '$lib/util/userUtils';

	export let data;

	const form = superForm(data.passwordForm, { invalidateAll: 'force' });
	const { form: formData, enhance } = form;
</script>

<svelte:head>
	<title>{createTitle('Change Password')}</title>
</svelte:head>

<BreadcrumbContainer includeHome>
	<Breadcrumb.Item>
		<Breadcrumb.Page>Password</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<h2 class="page-title mb-2">Change Password</h2>

<Section id="password-section">
	<Alert.Root class="mt-6 mb-4 w-fit pr-6 max-w-prose">
		<ShieldAlert class="size-4" />
		<Alert.Title class="mt-1">Heads up!</Alert.Title>
		<Alert.Description class="mb-1">
			After changing your password, you will be logged out immediately.
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

		<Input {form} name="current_password" label="Current password" maxlength={50} type="password" />

		<Input
			{form}
			name="new_password"
			label="New password"
			maxlength={50}
			type="password"
			description
		>
			<Checklist.Root class="pt-1 gap-1" slot="description">
				<Checklist.Item
					text="At least 8 characters"
					checked={$formData.new_password ? has8Chars($formData.new_password) : null}
				/>
				<Checklist.Item
					text="Must be different from your current password"
					checked={$formData.new_password
						? $formData.new_password !== $formData.current_password
						: null}
				/>
				<Checklist.Item
					text="Must not contain your username"
					checked={$formData.new_password
						? noUsername($formData.new_password, data.user.username)
						: null}
				/>
				<Checklist.Item
					text="Must contain at least 1 uppercase letter"
					checked={$formData.new_password ? hasUppercase($formData.new_password) : null}
				/>
				<Checklist.Item
					text="Must contain at least 1 lowercase letter"
					checked={$formData.new_password ? hasLowercase($formData.new_password) : null}
				/>
				<Checklist.Item
					text="Must contain at least 1 digit or special character"
					checked={$formData.new_password ? hasDigitOrSpecial($formData.new_password) : null}
				/>
			</Checklist.Root>
		</Input>

		<Input
			{form}
			name="confirm_new_password"
			label="Confirm new password"
			type="password"
			maxlength={50}
			description
		>
			<Checklist.Root class="pt-1 gap-1" slot="description">
				<Checklist.Item
					text="Passowrds match"
					checked={$formData.new_password || $formData.confirm_new_password
						? $formData.new_password === $formData.confirm_new_password
						: null}
				/>
			</Checklist.Root>
		</Input>

		<Form.Button class="w-fit min-w-24">Submit</Form.Button>
		<!-- <SuperDebug data={$formData} /> -->
	</form>
</Section>
