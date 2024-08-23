<script lang="ts">
	import { P, A } from 'flowbite-svelte';

	export let programId: number;
	export let roundId: number;
	export let applicationId: number;
	export let redirectToRoundChange: () => void;
</script>

<div class="flex flex-col gap-2 mt-4">
	<P size="sm" color="text-gray-600">
		Updating an admission plan will affect all applications under the plan. Do this only if you
		believe the current information is incomplete or incorrect.
	</P>
	<P size="sm" color="text-gray-600">
		If you want to switch to another plan for the current application,
		<A on:click={redirectToRoundChange}>click here</A>.
	</P>

	<A
		class="text-sm font-medium mt-4 mb-8"
		href={`/program/${programId}/plan/${roundId}?application=${applicationId}`}
	>
		I want to update the admission plan.
	</A>
</div>
