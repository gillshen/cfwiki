<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';

	import type { ApplicationListItem } from '$lib/api/application';
	import LinkWithIcon from '$lib/components/infobox/LinkWithIcon.svelte';

	export let application: ApplicationListItem;

	const { id, fullname } = application.student;
</script>

<TableBodyCell class="max-w-20 font-normal">
	<div class="translate-y-0.5">
		<LinkWithIcon href={`/student/${id}`} text={fullname} iconFirst={true} />
	</div>
</TableBodyCell>
