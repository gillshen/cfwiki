<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Heading, Hr, Label, Input, Helper, Button, Avatar, A, Alert } from 'flowbite-svelte';
	import { PenOutline, InfoCircleOutline } from 'flowbite-svelte-icons';

	import ChecklistItem from '$lib/components/list-items/ChecklistItem.svelte';
	import Toast from '$lib/components/misc/Toast.svelte';

	import {
		defaultBanner,
		passwordLongEnough,
		passwordHasUpper,
		passwordHasLower,
		passwordHasDigitOrSpecial,
		passwordHasUsername
	} from '$lib/utils/userUtils';

	export let data;

	const { form: userForm, enhance: userEnhance } = superForm(data.userForm, {
		invalidateAll: 'force',
		onUpdated({ form }) {
			if (form.valid) {
				editingBanner = false;
			} else {
				toastMessage = 'Sorry, something went wrong.';
				showErrorToast = true;
			}
		}
	});

	const { form: passwordForm, enhance: passwordEnhance } = superForm(data.passwordForm, {
		onUpdated({ form }) {
			if (form.valid) {
				changingPassword = false;
			} else {
				toastMessage = 'Your password fails to meet the requirements.';
				showErrorToast = true;
			}
		}
	});

	let editingBanner = false;
	let changingPassword = false;
	let toastMessage: string;
	let showErrorToast = false;
</script>

<Heading tag="h1" class="page-title flex gap-2 items-baseline">
	<Avatar bordered size="sm" class="translate-y-0.5" />{data.username}
</Heading>

<Hr />

<article class="h-[150px]">
	<Heading tag="h3" class="text-xl font-medium flex items-center section-title">
		Personal Page Title
	</Heading>

	{#if editingBanner}
		<form class="form-width mt-6" method="post" action="?/updateUser" use:userEnhance>
			<input type="number" name="id" class="hidden" value={data.user.id} />

			<Input
				id="banner"
				type="text"
				name="public_banner"
				maxlength="50"
				placeholder={defaultBanner(data.user.username)}
				bind:value={$userForm.public_banner}
			/>

			<Button type="submit" class="min-w-20 mt-4">Save</Button>
			<Button
				type="button"
				outline
				color="light"
				class="ms-1"
				on:click={() => (editingBanner = false)}>Cancel</Button
			>
		</form>
	{:else}
		<div class="form-width mt-6 text-sm font-medium p-3 rounded-lg text-gray-700 bg-stone-100">
			{data.user.public_banner || defaultBanner(data.user.username)}
		</div>
		<A class="mt-4 text-sm" on:click={() => (editingBanner = true)}>
			<PenOutline class="me-2 size-4" />Edit
		</A>
	{/if}
</article>

<article class="mt-12 pt-6 border-t-[1px] border-solid">
	<Heading tag="h3" class="text-xl font-medium flex items-center section-title">
		Change Password
	</Heading>

	{#if changingPassword}
		<form class="form-width mt-6" method="post" action="?/updatePassword" use:passwordEnhance>
			<input type="number" name="id" class="hidden" value={data.user.id} />

			<Label for="password" class="form-label">New password</Label>
			<Input
				id="password"
				type="password"
				name="password"
				maxlength="50"
				bind:value={$passwordForm.password}
				required
			/>
			<Helper class="form-helper mt-2">
				<ul class="flex flex-col gap-1">
					<ChecklistItem
						checkedText="Must not contain your username"
						checked={!passwordHasUsername($passwordForm.password, data.user.username)}
					/>
					<ChecklistItem
						checkedText="At least 8 characters"
						checked={passwordLongEnough($passwordForm.password)}
					/>
					<ChecklistItem
						checkedText="At least one uppercase letter"
						checked={passwordHasUpper($passwordForm.password)}
					/>
					<ChecklistItem
						checkedText="At least one lowercase letter"
						checked={passwordHasLower($passwordForm.password)}
					/>
					<ChecklistItem
						checkedText="At least one digit or special character"
						checked={passwordHasDigitOrSpecial($passwordForm.password)}
					/>
				</ul>
			</Helper>

			<Label for="repeat-password" class="form-label">Repeat the password</Label>
			<Input
				id="repeat-password"
				type="password"
				name="repeat_password"
				maxlength="50"
				bind:value={$passwordForm.repeat_password}
				required
			/>
			<Helper class="form-helper mt-2">
				<ChecklistItem
					checkedText="Passwords matched"
					unCheckedText="Passwords do not match"
					checked={$passwordForm.password === $passwordForm.repeat_password}
				/>
			</Helper>

			<Alert color="pink" class="mt-6 flex gap-2">
				<InfoCircleOutline />
				<span> After changing the password, you will be logged out immediately. </span>
			</Alert>

			<Button type="submit" class="mt-4">Change password</Button>
			<Button
				type="button"
				outline
				color="light"
				class="ms-1"
				on:click={() => (changingPassword = false)}>Cancel</Button
			>
		</form>
	{:else}
		<A class="text-sm mt-4" on:click={() => (changingPassword = true)}>Click to show the form</A>
	{/if}
</article>

{#if showErrorToast}
	<Toast type="error" onClose={() => (showErrorToast = false)}>
		{toastMessage}
	</Toast>
{/if}
