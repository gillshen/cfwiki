<script lang="ts">
	import { Badge, type ColorVariant } from 'flowbite-svelte';
	import type { StudentListItem } from '$lib/api/student';

	export let student: StudentListItem;

	let color: ColorVariant;
	let text: string;

	if (student.gender === 'female') {
		color = 'indigo';
		text = 'F';
	} else if (student.gender === 'male') {
		color = 'dark';
		text = 'M';
	} else {
		color = 'purple';
		text = 'X';
	}
</script>

<Badge {color} rounded class="w-[30px] h-[30px]">{text}</Badge>
