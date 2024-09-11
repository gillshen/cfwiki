<script lang="ts">
	import { Label, Input, Button, Heading, P } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const { form, message, enhance } = superForm(data.authForm);
</script>

<Heading tag="h1" class="text-3xl font-bold pb-4 flex gap-2 items-center">
	<img src="/favicon.png" class="me-1 h-10" alt="CF Logo" />
	ChoiceFreezer
</Heading>

<form method="post" action="?/login" use:enhance>
	<Label for="username" class="form-label">Username</Label>
	<Input
		id="username"
		type="text"
		name="username"
		maxlength="100"
		bind:value={$form.username}
		required
	/>

	<Label for="password" class="form-label">Password</Label>
	<Input
		id="password"
		type="password"
		name="password"
		maxlength="100"
		bind:value={$form.password}
		required
	/>

	<Button type="submit" outline class="mt-8 w-full uppercase tracking-wide">Log in</Button>

	<P size="sm" color="text-red-700" class="mt-4 h-6">{$message || ''}</P>
</form>
