<script lang="ts">
	import type { ProgramListItem } from '$lib/api/program';
	import LinkWithIcon from '$lib/components/infobox/LinkWithIcon.svelte';
	import { enhanceDisplayName } from '$lib/utils/programUtils';

	export let program: ProgramListItem;
</script>

<LinkWithIcon
	href={`/program/${program.id}`}
	text={enhanceDisplayName(program)}
	iconFirst={true}
	spanClass={program.is_defunct ? 'text-gray-400' : ''}
/>
