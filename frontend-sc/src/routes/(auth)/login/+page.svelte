<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import Input from '$lib/components/forms/Input.svelte';
	export let data;

	const form = superForm(data.authForm);
	const { message, enhance } = form;
</script>

<div class="w-fit m-auto space-y-8 pb-8">
	<h1 class="text-2xl font-bold pb-8">ChoiceFreezer</h1>

	<form method="POST" class="space-y-4" action="?/login" use:enhance id="login-form">
		<Input {form} name="username" label="Username" inputClass="w-[216px] bg-white" />

		<Input
			{form}
			name="password"
			label="Password"
			type="password"
			inputClass="w-[216px] bg-white"
			class="pb-2"
		/>

		<Form.Button class="w-full">Log in</Form.Button>
		{#if $message}
			<p class="text-sm font-medium text-rose-600">{$message}</p>
		{/if}
	</form>
</div>
