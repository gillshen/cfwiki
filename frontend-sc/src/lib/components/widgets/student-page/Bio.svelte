<script lang="ts">
	import Globe from 'lucide-svelte/icons/globe';
	import Venus from 'lucide-svelte/icons/venus';
	import Mars from 'lucide-svelte/icons/mars';
	import NonBinary from 'lucide-svelte/icons/non-binary';
	import Gift from 'lucide-svelte/icons/gift';
	import House from 'lucide-svelte/icons/house';
	import NotepadText from 'lucide-svelte/icons/notepad-text';

	import type { StudentDetail } from '$lib/api/student';
	import Field from './Field.svelte';
	import countryFlags from '$lib/constants/countries';
	import { formatLocation } from '$lib/util/studentUtils';
	import { toShortDate } from '$lib/util/dateUtils';
	import { toTitleCase } from '$lib/util/stringUtils';

	export let student: StudentDetail;
</script>

<section class="flex flex-col gap-4 text-sm grow-0 shrink-0">
	<Field
		icon={Globe}
		key="Citizenship"
		value="{student.citizenship}&nbsp; {countryFlags[student.citizenship]}"
	/>
	<Field
		icon={student.gender === 'male' ? Mars : student.gender === 'female' ? Venus : NonBinary}
		key="Gender"
		value={toTitleCase(student.gender)}
	/>
	<Field icon={Gift} key="Date of Birth" value={toShortDate(student.date_of_birth)} />
	<Field
		icon={House}
		key="Residence"
		value="{formatLocation(student)}&nbsp; {countryFlags[student.base_country]}"
	/>
	<Field icon={NotepadText} key="Comments" value={student.comments} />
</section>
