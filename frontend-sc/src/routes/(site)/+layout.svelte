<script lang="ts">
	import { page } from '$app/stores';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import StudentSideList from '$lib/components/widgets/StudentSideList.svelte';
	import { quickAccessYears } from '$lib/util/dateUtils';

	export let data;

	$: dataGridPage =
		$page.url.pathname.startsWith('/data-grids/students') ||
		$page.url.pathname.startsWith('/data-grids/applications');
</script>

<div class={`container w-full ${dataGridPage ? 'max-w-full' : ''} mx-auto pb-8 flex-grow-0`}>
	<div
		class="fixed top-0 left-0 w-full h-[60px] backdrop-blur bg-white/70 shadow-sm z-40 flex flex-row justify-between items-center px-8"
	>
		<nav class="flex gap-4 my-2 max-w-7xl">
			<Button variant="ghost" href="/home" class="text-black font-medium hover:no-underline"
				>Home</Button
			>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>CF People</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>TODO</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>TODO</DropdownMenu.Item>
						<DropdownMenu.Item>TODO</DropdownMenu.Item>
						<DropdownMenu.Item>TODO</DropdownMenu.Item>
						<DropdownMenu.Item>TODO</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>Students</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						{#each quickAccessYears() as year}
							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>{year}</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent>
									<DropdownMenu.Item
										href={`/data-grids/students?targetYear=${year}&contractType=UG+Freshman`}
										class="text-inherit hover:no-underline">UG Freshman</DropdownMenu.Item
									>
									<DropdownMenu.Item
										href={`/data-grids/students?targetYear=${year}&contractType=UG+Transfer`}
										class="text-inherit hover:no-underline">UG Transfer</DropdownMenu.Item
									>
									<DropdownMenu.Item
										href={`/data-grids/students?targetYear=${year}&contractType=Graduate`}
										class="text-inherit hover:no-underline">Graduate</DropdownMenu.Item
									>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
						{/each}
						<DropdownMenu.Separator />
						<DropdownMenu.Item href="/data-grids/students" class="text-inherit hover:no-underline"
							>All Students</DropdownMenu.Item
						>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>Applications</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						{#each quickAccessYears() as year}
							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>{year}</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent>
									<DropdownMenu.Label>Undergraduate</DropdownMenu.Label>
									<DropdownMenu.Item
										href={`/data-grids/applications?year=${year}&applicationType=freshman`}
										class="text-inherit hover:no-underline">Freshman</DropdownMenu.Item
									>
									<DropdownMenu.Item
										href={`/data-grids/applications?year=${year}&applicationType=transfer`}
										class="text-inherit hover:no-underline">Transfer</DropdownMenu.Item
									>
									<DropdownMenu.Separator />
									<DropdownMenu.Label>Graduate</DropdownMenu.Label>
									<DropdownMenu.Item
										href={`/data-grids/applications?year=${year}&applicationType=masters`}
										class="text-inherit hover:no-underline">Master&rsquo;s</DropdownMenu.Item
									>
									<DropdownMenu.Item
										href={`/data-grids/applications?year=${year}&applicationType=doctorate`}
										class="text-inherit hover:no-underline">Doctorate</DropdownMenu.Item
									>
									<DropdownMenu.Separator />
									<DropdownMenu.Item
										href={`/data-grids/applications?year=${year}&applicationType=other`}
										class="text-inherit hover:no-underline">Non-degree</DropdownMenu.Item
									>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
						{/each}
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							href="/data-grids/applications"
							class="text-inherit hover:no-underline">All Applications</DropdownMenu.Item
						>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>Schools</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Item
							href="/school/index/#universities"
							class="text-inherit hover:no-underline">Universities</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/school/index/#secondary-schools"
							class="text-inherit hover:no-underline">Secondary Schools</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/school/index/#other-institutions"
							class="text-inherit hover:no-underline">Other Institutions</DropdownMenu.Item
						>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>Rankings</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>Programs</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Item
							href="/program/index/#ug-freshman"
							class="text-inherit hover:no-underline">UG Freshman</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/program/index/#ug-transfer"
							class="text-inherit hover:no-underline">UG Transfer</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/program/index/#masters"
							class="text-inherit hover:no-underline">Master&rsquo;s</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/program/index/#doctorate"
							class="text-inherit hover:no-underline">Doctorate</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/program/index/#non-degree"
							class="text-inherit hover:no-underline">Non-degree</DropdownMenu.Item
						>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>Program Collections</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</nav>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="secondary" builders={[builder]}>My Account</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Label>{data.username}</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Settings</DropdownMenu.Item>
					<DropdownMenu.Item href="/logout" class="text-inherit hover:no-underline"
						>Log Out</DropdownMenu.Item
					>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<div class="mt-[76px] flex flex-col min-h-[calc(100vh-360px)] flex-grow">
		<div class="flex">
			{#if !dataGridPage}
				<div class="w-[240px] min-w-[240px] h-full overflow-auto pt-2 py-4 pl-4 pr-8">
					<slot name="sidebar" />
					{#await data.students then students}
						<StudentSideList {students} />
					{/await}
				</div>
			{/if}
			<div class="flex flex-col pl-4 w-full">
				<slot />
			</div>
		</div>
	</div>
</div>
