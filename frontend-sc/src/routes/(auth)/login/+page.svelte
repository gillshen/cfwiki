<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import Input from '$lib/components/ui/input/input.svelte';

	export let data;

	const form = superForm(data.authForm);
	const { form: formData, message, enhance } = form;
</script>

<div class="mx-auto space-y-12 px-4 pt-4 pb-20">
	<h1 class="text-3xl font-bold">ChoiceFreezer</h1>

	<form method="POST" class="space-y-6" action="?/login" use:enhance id="login-form">
		<Form.Field {form} name="username">
			<Form.Control let:attrs>
				<Form.Label>Username</Form.Label>
				<Input {...attrs} bind:value={$formData.username} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="password">
			<Form.Control let:attrs>
				<Form.Label>Password</Form.Label>
				<Input type="password" {...attrs} bind:value={$formData.password} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Button class="w-full">Log in</Form.Button>
	</form>
</div>
