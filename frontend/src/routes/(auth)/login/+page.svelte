<script lang="ts">
	import { Label, Input, Button, Heading } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const { form, enhance } = superForm(data.authForm);
</script>

<Heading tag="h1" class="text-3xl font-bold pb-4">Log in</Heading>

<form method="post" action="?/login" use:enhance>
	<Label for="username" class="form-label">Username</Label>
	<Input id="username" type="text" name="username" bind:value={$form.username} required />

	<Label for="password" class="form-label">Password</Label>
	<Input id="password" type="password" name="password" bind:value={$form.password} required />

	<Button type="submit" class="mt-8">Login</Button>
</form>
