<script lang="ts">
	import { Badge } from 'flowbite-svelte';
	import type { StudentListItem } from '$lib/api/student';

	export let student: StudentListItem;

	let color: string;
	let text: string;

	if (student.gender === 'female') {
		color = 'bg-stone-200 text-gray-700';
		text = 'F';
	} else if (student.gender === 'male') {
		color = 'bg-stone-500 text-white';
		text = 'M';
	} else {
		color = 'bg-primary-600 text-white';
		text = 'X';
	}
</script>

<Badge rounded class={`w-[28px] h-[28px] font-normal ${color}`}>{text}</Badge>
