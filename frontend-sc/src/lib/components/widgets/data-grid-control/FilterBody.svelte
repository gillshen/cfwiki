<script lang="ts">
	import * as Select from '$lib/components/ui/select/index';

	import SelectBody from '$lib/components/containers/SelectBody.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	export let items: { value: any; label: string }[];
</script>

<SelectBody {items}>
	<svelte:fragment slot="top-items">
		<Select.Item value="All">All</Select.Item>
		<Separator class="my-1" />
	</svelte:fragment>
	<slot />
</SelectBody>
