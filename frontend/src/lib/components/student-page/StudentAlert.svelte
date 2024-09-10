<script lang="ts">
	import { Alert, A } from 'flowbite-svelte';
	import { InfoCircleOutline } from 'flowbite-svelte-icons';

	import type { StudentDetail } from '$lib/api/student';

	export let student: StudentDetail;
	export let addContract: () => void;

	const pronoun = student.gender === 'male' ? 'him' : student.gender === 'female' ? 'her' : 'them';
</script>

{#if !student.contracts.length}
	<Alert color="yellow" class="mb-4 flex gap-2">
		<InfoCircleOutline />
		<span>
			This student has no contract associated with {pronoun} and consequently does not appear on any
			CFer&rsquo;s homepage. If this is your student, please claim {pronoun} by <A
				on:click={addContract}>adding a contract</A
			> and then adding yourself as a staff member.
		</span>
	</Alert>
{:else if !student.contracts.filter((c) => !!c.services.length).length}
	<Alert color="yellow" class="mb-4 flex gap-2">
		<InfoCircleOutline />
		<span>
			This student has not been &ldquo;claimed&rdquo; by any CFer. If this is your student, please
			add yourself to the staff of the appropriate contract(s).
		</span>
	</Alert>
{/if}
