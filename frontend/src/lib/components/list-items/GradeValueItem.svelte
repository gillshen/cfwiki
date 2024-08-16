<script lang="ts">
	import { formatGradeValue } from '$lib/utils/gradesUtils';

	export let value: number | string;
	export let scale: number | string;
</script>

<span class="flex gap-[.1rem] tabular-nums">
	<span class="font-medium">{formatGradeValue(value, scale)}</span>
	<span class="text-gray-400 font-normal">/</span>
	<span class="text-gray-400 font-normal">{formatGradeValue(scale)}</span>
</span>
