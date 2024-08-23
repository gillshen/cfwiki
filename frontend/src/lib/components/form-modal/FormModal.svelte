<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Modal } from 'flowbite-svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';

	import Toast from '$lib/components/misc/Toast.svelte';

	export let superform: SuperValidated<any>;
	export let fields: any;
	export let action: string;
	export let open: boolean;
	export let entity: any = null;
	export let extra: { name: string; type: string; value: any }[] = [];
	export let title: string = '';

	const dispatch = createEventDispatcher();

	const { form, message, errors, enhance } = superForm(superform, {
		id: action,
		onUpdated({ form }) {
			if (form.valid) {
				dispatch('close');
			} else {
				showToast = true;
			}
		}
	});

	let showToast = false;
</script>

<Modal {title} bind:open outsideclose on:close={() => dispatch('close')}>
	<form class="modal" method="post" {action} use:enhance>
		{#each extra as { name, type, value }}
			<input {name} {type} {value} class="hidden" />
		{/each}
		<div class="form-width mx-auto">
			<slot name="preface" />
			<svelte:component this={fields} {form} {message} {errors} {entity} {...$$restProps} />
			<slot />
		</div>
	</form>
</Modal>

{#if showToast}
	<Toast type="error" onClose={() => (showToast = false)}>
		Operation failed. Maybe you were trying to duplicate an existing record?
	</Toast>
{/if}
