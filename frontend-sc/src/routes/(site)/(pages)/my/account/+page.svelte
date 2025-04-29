<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as RadioGroup from '$lib/components/ui/radio-group/index';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import FormField from '$lib/components/ui/form/form-field.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import { createTitle } from '$lib/util/siteUtils';
	import { defaultBanner } from '$lib/util/userUtils.js';
	import { avatars } from '$lib/assets/avatars';

	export let data;

	const form = superForm(data.userUpdateForm, { invalidateAll: 'force' });
	const { form: formData, enhance } = form;
</script>

<svelte:head>
	<title>{createTitle('My Account')}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Page>Appearance</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<h1 class="page-title mb-2">Manage Appearance</h1>

<Section id="user-form-section">
	<form
		method="POST"
		action="?/updateUser"
		class="max-w-prose space-y-6 mt-4"
		id="user-form"
		use:enhance
	>
		<input name="id" bind:value={data.user.id} hidden />

		<FormField {form} name="public_banner">
			<Form.Control let:attrs>
				<Form.Label>Homepage title</Form.Label>
				<Input
					placeholder={defaultBanner(data.username)}
					class="w-[360px]"
					maxlength={100}
					{...attrs}
					bind:value={$formData.public_banner}
				/>
			</Form.Control>
		</FormField>

		<FormField {form} name="avatar">
			<Form.Control>
				<Form.Label>Avatar</Form.Label>
				<RadioGroup.Root
					bind:value={$formData.avatar}
					class="pt-1 w-[360px] grid grid-cols-5 space-between gap-4"
				>
					{#each Object.entries(avatars) as [avatarKey, avatarPath]}
						<Label
							for={avatarKey}
							class="size-12 rounded-md flex border-2 bg-popover hover:bg-accent [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
						>
							<RadioGroup.Item
								value={avatarPath}
								id={avatarKey}
								aria-label={avatarKey}
								class="sr-only"
							/>
							<img src={avatarPath} alt={avatarKey} class="size-7 m-auto" />
						</Label>
					{/each}
					<RadioGroup.Input name="avatar" />
				</RadioGroup.Root>
			</Form.Control>
		</FormField>

		<Form.Button>Submit</Form.Button>
		<!-- <SuperDebug data={$formData} /> -->
	</form>
</Section>
