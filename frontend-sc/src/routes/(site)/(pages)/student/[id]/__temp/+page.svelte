<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index';

	import * as ScoreForm from '$lib/components/forms/score-forms/index';
	import ActionUnit from '$lib/components/containers/ActionUnit.svelte';
	import DeleteForm from '$lib/components/forms/DeleteForm.svelte';
	import ProgramForm from '$lib/components/forms/program-form/ProgramForm.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import DismissibleBadge from '$lib/components/misc/DismissibleBadge.svelte';

	export let data;
</script>

<Tabs.Root value="temp">
	<Tabs.List>
		<Tabs.Trigger value="temp">temp</Tabs.Trigger>
		<Tabs.Trigger value="toefl">TOEFL</Tabs.Trigger>
		<Tabs.Trigger value="ielts">IELTS</Tabs.Trigger>
		<Tabs.Trigger value="duolingo">Duolingo</Tabs.Trigger>
		<Tabs.Trigger value="sat">SAT</Tabs.Trigger>
		<Tabs.Trigger value="act">ACT</Tabs.Trigger>
		<Tabs.Trigger value="gre">GRE</Tabs.Trigger>
		<Tabs.Trigger value="gmat">GMAT</Tabs.Trigger>
		<Tabs.Trigger value="lsat">LSAT</Tabs.Trigger>
		<Tabs.Trigger value="ap">AP</Tabs.Trigger>
		<Tabs.Trigger value="ib">IB</Tabs.Trigger>
		<Tabs.Trigger value="alevel">A-level</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="temp">
		<h2 class="text-2xl font-bold mt-4 mb-8">Create Program</h2>
		<div class="w-fit">
			<div>
				<Button
					variant="outline"
					class="hover:bg-white px-2 flex flex-wrap justify-start gap-2 w-[420px] h-fit"
				>
					<DismissibleBadge class="h-7 rounded-sm">Princeton University</DismissibleBadge>
					<DismissibleBadge class="h-7 rounded-sm">Yale University</DismissibleBadge>
					<DismissibleBadge class="h-7 rounded-sm">Duke University</DismissibleBadge>
				</Button>
			</div>
			{#await data.schools}
				<LoadingSign />
			{:then schools}
				<ProgramForm data={data.newProgramForm} {schools} onUpdated={() => alert('submitted')} />
			{/await}
		</div>
	</Tabs.Content>

	<!-- TOEFL -->
	<Tabs.Content value="toefl">
		<div class="flex gap-6">
			<div class="w-[300px] pt-4 text-sm flex flex-col gap-2">
				{#each data.student.toefl as score}
					<div class="p-4 border-2 border-primary rounded-xl">
						<pre class="mb-2">{JSON.stringify(score, null, 2)}</pre>
						<div class="flex justify-end gap-2">
							<ActionUnit
								updateDiologTitle="Update TOEFL Score"
								deleteDialogTitle="Delete this TOEFL score?"
							>
								<ScoreForm.Toefl
									slot="update-form"
									let:closeUpdateModal
									data={data.toeflForm}
									{score}
									studentId={data.student.id}
									onUpdated={({ form }) => form.valid && closeUpdateModal()}
								/>
								<DeleteForm
									slot="delete-form"
									let:closeDeleteModal
									data={data.deleteForm}
									objectId={score.id}
									action="?/deleteToeflScore"
									onUpdated={({ form }) => form.valid && closeDeleteModal()}
									onCancel={closeDeleteModal}
								/>
							</ActionUnit>
						</div>
					</div>
				{/each}
			</div>

			<ScoreForm.Toefl
				data={data.toeflForm}
				studentId={data.student.id}
				onUpdated={({ form }) => form.valid && alert('success')}
			/>
		</div>
	</Tabs.Content>

	<!-- IELTS -->
	<Tabs.Content value="ielts">
		<div class="flex gap-6">
			<div class="w-[300px] pt-4 text-sm flex flex-col gap-2">
				{#each data.student.ielts as score}
					<div class="p-4 border-2 border-primary rounded-xl">
						<pre class="mb-2">{JSON.stringify(score, null, 2)}</pre>
						<div class="flex justify-end gap-2">
							<ActionUnit
								updateDiologTitle="Update IELTS Score"
								deleteDialogTitle="Delete this IELTS score?"
							>
								<ScoreForm.Ielts
									slot="update-form"
									let:closeUpdateModal
									data={data.ieltsForm}
									{score}
									studentId={data.student.id}
									onUpdated={({ form }) => form.valid && closeUpdateModal()}
								/>
								<DeleteForm
									slot="delete-form"
									let:closeDeleteModal
									data={data.deleteForm}
									objectId={score.id}
									action="?/deleteIeltsScore"
									onUpdated={({ form }) => form.valid && closeDeleteModal()}
									onCancel={closeDeleteModal}
								/>
							</ActionUnit>
						</div>
					</div>
				{/each}
			</div>

			<ScoreForm.Ielts
				data={data.toeflForm}
				studentId={data.student.id}
				onUpdated={({ form }) => form.valid && alert('success')}
			/>
		</div>
	</Tabs.Content>

	<!-- Duolingo -->
	<Tabs.Content value="duolingo">
		<div class="flex gap-6">
			<div class="w-[300px] pt-4 text-sm flex flex-col gap-2">
				{#each data.student.duolingo as score}
					<div class="p-4 border-2 border-primary rounded-xl">
						<pre class="mb-2">{JSON.stringify(score, null, 2)}</pre>
						<div class="flex justify-end gap-2">
							<ActionUnit
								updateDiologTitle="Update Duolingo Score"
								deleteDialogTitle="Delete this Duolingo score?"
							>
								<ScoreForm.Duolingo
									slot="update-form"
									let:closeUpdateModal
									data={data.duolingoForm}
									{score}
									studentId={data.student.id}
									onUpdated={({ form }) => form.valid && closeUpdateModal()}
								/>
								<DeleteForm
									slot="delete-form"
									let:closeDeleteModal
									data={data.deleteForm}
									objectId={score.id}
									action="?/deleteDuolingoScore"
									onUpdated={({ form }) => form.valid && closeDeleteModal()}
									onCancel={closeDeleteModal}
								/>
							</ActionUnit>
						</div>
					</div>
				{/each}
			</div>

			<ScoreForm.Duolingo
				data={data.duolingoForm}
				studentId={data.student.id}
				onUpdated={({ form }) => form.valid && alert('success')}
			/>
		</div>
	</Tabs.Content>

	<!-- SAT -->
	<Tabs.Content value="sat">
		<div class="flex gap-6">
			<div class="w-[300px] pt-4 text-sm flex flex-col gap-2">
				{#each data.student.sat as score}
					<div class="p-4 border-2 border-primary rounded-xl">
						<pre class="mb-2">{JSON.stringify(score, null, 2)}</pre>
						<div class="flex justify-end gap-2">
							<ActionUnit
								updateDiologTitle="Update SAT Score"
								deleteDialogTitle="Delete this SAT score?"
							>
								<ScoreForm.Sat
									slot="update-form"
									let:closeUpdateModal
									data={data.satForm}
									{score}
									studentId={data.student.id}
									onUpdated={({ form }) => form.valid && closeUpdateModal()}
								/>

								<DeleteForm
									slot="delete-form"
									let:closeDeleteModal
									data={data.deleteForm}
									objectId={score.id}
									action="?/deleteSatScore"
									onUpdated={({ form }) => form.valid && closeDeleteModal()}
									onCancel={closeDeleteModal}
								/>
							</ActionUnit>
						</div>
					</div>
				{/each}
			</div>

			<ScoreForm.Sat
				data={data.satForm}
				studentId={data.student.id}
				onUpdated={({ form }) => form.valid && alert('success')}
			/>
		</div>
	</Tabs.Content>

	<!-- ACT -->
	<Tabs.Content value="act">
		<div class="flex gap-6">
			<div class="w-[300px] pt-4 text-sm flex flex-col gap-2">
				{#each data.student.act as score}
					<div class="p-4 border-2 border-primary rounded-xl">
						<pre class="mb-2">{JSON.stringify(score, null, 2)}</pre>
						<div class="flex justify-end gap-2">
							<ActionUnit
								updateDiologTitle="Update ACT Score"
								deleteDialogTitle="Delete this ACT score?"
							>
								<ScoreForm.Act
									slot="update-form"
									let:closeUpdateModal
									data={data.actForm}
									{score}
									studentId={data.student.id}
									onUpdated={({ form }) => form.valid && closeUpdateModal()}
								/>

								<DeleteForm
									slot="delete-form"
									let:closeDeleteModal
									data={data.deleteForm}
									objectId={score.id}
									action="?/deleteActScore"
									onUpdated={({ form }) => form.valid && closeDeleteModal()}
									onCancel={closeDeleteModal}
								/>
							</ActionUnit>
						</div>
					</div>
				{/each}
			</div>

			<ScoreForm.Act
				data={data.actForm}
				studentId={data.student.id}
				onUpdated={({ form }) => form.valid && alert('success')}
			/>
		</div>
	</Tabs.Content>

	<!-- GRE -->
	<Tabs.Content value="gre">
		<div class="flex gap-6">
			<div class="w-[300px] pt-4 text-sm flex flex-col gap-2">
				{#each data.student.gre as score}
					<div class="p-4 border-2 border-primary rounded-xl">
						<pre class="mb-2">{JSON.stringify(score, null, 2)}</pre>
						<div class="flex justify-end gap-2">
							<ActionUnit
								updateDiologTitle="Update GRE Score"
								deleteDialogTitle="Delete this GRE score?"
							>
								<ScoreForm.Gre
									slot="update-form"
									let:closeUpdateModal
									data={data.greForm}
									{score}
									studentId={data.student.id}
									onUpdated={({ form }) => form.valid && closeUpdateModal()}
								/>

								<DeleteForm
									slot="delete-form"
									let:closeDeleteModal
									data={data.deleteForm}
									objectId={score.id}
									action="?/deleteGreScore"
									onUpdated={({ form }) => form.valid && closeDeleteModal()}
									onCancel={closeDeleteModal}
								/>
							</ActionUnit>
						</div>
					</div>
				{/each}
			</div>

			<ScoreForm.Gre
				data={data.greForm}
				studentId={data.student.id}
				onUpdated={({ form }) => form.valid && alert('success')}
			/>
		</div>
	</Tabs.Content>

	<!-- GMAT -->
	<Tabs.Content value="gmat">
		<div class="flex gap-6">
			<div class="w-[300px] pt-4 text-sm flex flex-col gap-2">
				{#each data.student.gmat as score}
					<div class="p-4 border-2 border-primary rounded-xl">
						<pre class="mb-2">{JSON.stringify(score, null, 2)}</pre>
						<div class="flex justify-end gap-2">
							<ActionUnit
								updateDiologTitle="Update GMAT Score"
								deleteDialogTitle="Delete this GMAT score?"
							>
								<ScoreForm.Gmat
									slot="update-form"
									let:closeUpdateModal
									data={data.gmatForm}
									{score}
									studentId={data.student.id}
									onUpdated={({ form }) => form.valid && closeUpdateModal()}
								/>

								<DeleteForm
									slot="delete-form"
									let:closeDeleteModal
									data={data.deleteForm}
									objectId={score.id}
									action="?/deleteGmatScore"
									onUpdated={({ form }) => form.valid && closeDeleteModal()}
									onCancel={closeDeleteModal}
								/>
							</ActionUnit>
						</div>
					</div>
				{/each}
			</div>

			<ScoreForm.Gmat
				data={data.gmatForm}
				studentId={data.student.id}
				onUpdated={({ form }) => form.valid && alert('success')}
			/>
		</div>
	</Tabs.Content>

	<!-- LSAT -->
	<Tabs.Content value="lsat">
		<div class="flex gap-6">
			<div class="w-[300px] pt-4 text-sm flex flex-col gap-2">
				{#each data.student.lsat as score}
					<div class="p-4 border-2 border-primary rounded-xl">
						<pre class="mb-2">{JSON.stringify(score, null, 2)}</pre>
						<div class="flex justify-end gap-2">
							<ActionUnit
								updateDiologTitle="Update LSAT Score"
								deleteDialogTitle="Delete this LSAT score?"
							>
								<ScoreForm.Lsat
									slot="update-form"
									let:closeUpdateModal
									data={data.lsatForm}
									{score}
									studentId={data.student.id}
									onUpdated={({ form }) => form.valid && closeUpdateModal()}
								/>

								<DeleteForm
									slot="delete-form"
									let:closeDeleteModal
									data={data.deleteForm}
									objectId={score.id}
									action="?/deleteLsatScore"
									onUpdated={({ form }) => form.valid && closeDeleteModal()}
									onCancel={closeDeleteModal}
								/>
							</ActionUnit>
						</div>
					</div>
				{/each}
			</div>

			<ScoreForm.Lsat
				data={data.lsatForm}
				studentId={data.student.id}
				onUpdated={({ form }) => form.valid && alert('success')}
			/>
		</div>
	</Tabs.Content>

	<!-- AP -->
	<Tabs.Content value="ap">
		<div class="flex gap-6">
			<div class="w-[300px] pt-4 text-sm flex flex-col gap-2">
				{#each data.student.ap as score}
					<div class="p-4 rounded-none border-2 border-primary shadow-[8px_8px_0px_#6dbb75]">
						<pre class="mb-2">{JSON.stringify(score, null, 2)}</pre>
						<div class="flex justify-end gap-2">
							<ActionUnit
								updateDiologTitle="Update AP Score"
								deleteDialogTitle="Delete this AP score?"
							>
								<ScoreForm.Ap
									slot="update-form"
									let:closeUpdateModal
									data={data.apForm}
									{score}
									studentId={data.student.id}
									onUpdated={({ form }) => form.valid && closeUpdateModal()}
								/>

								<DeleteForm
									slot="delete-form"
									let:closeDeleteModal
									data={data.deleteForm}
									objectId={score.id}
									action="?/deleteApScore"
									onUpdated={({ form }) => form.valid && closeDeleteModal()}
									onCancel={closeDeleteModal}
								/>
							</ActionUnit>
						</div>
					</div>
				{/each}
			</div>

			<ScoreForm.Ap
				data={data.apForm}
				studentId={data.student.id}
				onUpdated={({ form }) => form.valid && alert('success')}
			/>
		</div>
	</Tabs.Content>

	<!-- IB -->
	<Tabs.Content value="ib">
		<div class="flex gap-6">
			<div class="w-[300px] pt-4 text-sm flex flex-col gap-2">
				{#each data.student.ib as score}
					<div class="p-4 rounded-none border-2 border-primary shadow-[8px_8px_0px_#6dbb75]">
						<pre class="mb-2">{JSON.stringify(score, null, 2)}</pre>
						<div class="flex justify-end gap-2">
							<ActionUnit
								updateDiologTitle="Update IB Grade"
								deleteDialogTitle="Delete this IB grade?"
							>
								<ScoreForm.Ib
									slot="update-form"
									let:closeUpdateModal
									data={data.ibForm}
									{score}
									studentId={data.student.id}
									onUpdated={({ form }) => form.valid && closeUpdateModal()}
								/>

								<DeleteForm
									slot="delete-form"
									let:closeDeleteModal
									data={data.deleteForm}
									objectId={score.id}
									action="?/deleteIbGrade"
									onUpdated={({ form }) => form.valid && closeDeleteModal()}
									onCancel={closeDeleteModal}
								/>
							</ActionUnit>
						</div>
					</div>
				{/each}
			</div>

			<ScoreForm.Ib
				data={data.ibForm}
				studentId={data.student.id}
				onUpdated={({ form }) => form.valid && alert('success')}
			/>
		</div>
	</Tabs.Content>

	<!-- A-level -->
	<Tabs.Content value="alevel">
		<div class="flex gap-6">
			<div class="w-[300px] pt-4 text-sm flex flex-col gap-2">
				{#each data.student.alevel as score}
					<div class="p-4 rounded-none border-2 border-primary shadow-[8px_8px_0px_#6dbb75]">
						<pre class="mb-2">{JSON.stringify(score, null, 2)}</pre>
						<div class="flex justify-end gap-2">
							<ActionUnit
								updateDiologTitle="Update A-level Grade"
								deleteDialogTitle="Delete this A-level grade?"
							>
								<ScoreForm.Alevel
									slot="update-form"
									let:closeUpdateModal
									data={data.alevelForm}
									{score}
									studentId={data.student.id}
									onUpdated={({ form }) => form.valid && closeUpdateModal()}
								/>

								<DeleteForm
									slot="delete-form"
									let:closeDeleteModal
									data={data.deleteForm}
									objectId={score.id}
									action="?/deleteAlevelGrade"
									onUpdated={({ form }) => form.valid && closeDeleteModal()}
									onCancel={closeDeleteModal}
								/>
							</ActionUnit>
						</div>
					</div>
				{/each}
			</div>

			<ScoreForm.Alevel
				data={data.alevelForm}
				studentId={data.student.id}
				onUpdated={({ form }) => form.valid && alert('success')}
			/>
		</div>
	</Tabs.Content>
</Tabs.Root>
