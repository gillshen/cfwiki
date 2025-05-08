<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index';

	import * as ScoreForm from '$lib/components/forms/score-forms/index';
	import * as ScoreActionItem from '$lib/components/widgets/score-action-items/index';

	export let data;
</script>

<Tabs.Root value="toefl">
	<Tabs.List>
		<Tabs.Trigger value="toefl" class="text-mint-600">TOEFL</Tabs.Trigger>
		<Tabs.Trigger value="ielts" class="text-purple-600">IELTS</Tabs.Trigger>
		<Tabs.Trigger value="duolingo">Duolingo</Tabs.Trigger>
		<Tabs.Trigger value="sat">SAT</Tabs.Trigger>
		<Tabs.Trigger value="act">ACT</Tabs.Trigger>
		<Tabs.Trigger value="gre">GRE</Tabs.Trigger>
		<Tabs.Trigger value="gmat">GMAT</Tabs.Trigger>
		<Tabs.Trigger value="lsat">LSAT</Tabs.Trigger>
	</Tabs.List>

	<!-- TOEFL -->
	<Tabs.Content value="toefl">
		<div class="flex gap-6 bg-mint-100">
			<div class="w-[300px] pt-4 text-sm flex flex-col gap-2">
				{#each data.student.toefl as score}
					<div class="p-4 border-2 border-primary rounded-xl">
						<pre class="mb-2">{JSON.stringify(score, null, 2)}</pre>
						<div class="flex justify-end gap-2">
							<ScoreActionItem.Toefl
								{score}
								studentId={data.student.id}
								updateForm={data.toeflForm}
								deleteForm={data.deleteForm}
							/>
						</div>
					</div>
				{/each}
			</div>

			<ScoreForm.Toefl
				data={data.toeflForm}
				studentId={data.student.id}
				action="?/createOrUpdateToeflScore"
				onUpdated={({ form }) => form.valid && alert('success')}
			/>
		</div>
	</Tabs.Content>

	<!-- IELTS -->
	<Tabs.Content value="ielts">
		<div class="flex gap-6 bg-purple-100">
			<div class="w-[300px] pt-4 text-sm flex flex-col gap-2">
				{#each data.student.ielts as score}
					<div class="p-4 border-2 border-primary rounded-xl">
						<pre class="mb-2">{JSON.stringify(score, null, 2)}</pre>
						<div class="flex justify-end gap-2">
							<ScoreActionItem.Ielts
								{score}
								studentId={data.student.id}
								updateForm={data.ieltsForm}
								deleteForm={data.deleteForm}
							/>
						</div>
					</div>
				{/each}
			</div>

			<ScoreForm.Ielts
				data={data.toeflForm}
				studentId={data.student.id}
				action="?/createOrUpdateIeltsScore"
				onUpdated={({ form }) => form.valid && alert('success')}
			/>
		</div>
	</Tabs.Content>
</Tabs.Root>
