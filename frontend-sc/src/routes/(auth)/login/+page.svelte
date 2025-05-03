<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import Input from '$lib/components/forms/Input.svelte';
	export let data;

	const form = superForm(data.authForm);
	const { enhance } = form;
</script>

<div class="mx-auto space-y-8 px-4 pt-4 pb-12">
	<h1 class="text-3xl font-bold">ChoiceFreezer</h1>

	<form method="POST" class="space-y-4" action="?/login" use:enhance id="login-form">
		<Input {form} name="username" label="Username" inputClass="w-full" />

		<Input
			{form}
			name="password"
			label="Password"
			type="password"
			inputClass="w-full"
			class="pb-2"
		/>

		<Form.Button class="w-full">Log in</Form.Button>
	</form>
</div>
