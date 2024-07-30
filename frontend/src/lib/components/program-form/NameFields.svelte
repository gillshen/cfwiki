<script lang="ts">
	import { Label, Input } from 'flowbite-svelte';

	export let form: any;
	export let requireDegree = false;
</script>

<Label for="name" class="form-label">Program name</Label>
<Input id="name" name="name" bind:value={$form.name} />

{#if requireDegree}
	<Label for="degree" class="form-label">Degree awarded</Label>
	<Input id="degree" type="text" name="degree" bind:value={$form.degree} required />
{/if}
