<script lang="ts">
	import * as Select from '$lib/components/ui/select/index';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import SelectBody from '$lib/components/containers/SelectBody.svelte';
	import type { SelectOption } from '$lib/util/formUtils';

	export let items: (SelectOption | string | number)[];
</script>

<SelectBody {items} triggerClass="w-[200px]" contentClass="max-h-[calc(50vh-160px)]">
	<svelte:fragment slot="top-items">
		<Select.Item value="All">All</Select.Item>
		<Separator class="my-1" />
	</svelte:fragment>
</SelectBody>
