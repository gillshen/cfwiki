<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { Tabs, TabItem, A } from 'flowbite-svelte';
</script>

<div class="p-24 w-[60rem]">
	<Tabs tabStyle="underline">
		<TabItem title="Students" open>
			<Button class="mb-4" href="/student/new/">Create a student file</Button>
			<div>
				<A href="/data/students/">List of students</A>
			</div>
		</TabItem>

		<TabItem title="Applications">
			<Button class="mb-4" href="">Create an application</Button>
		</TabItem>

		<TabItem title="Schools">
			<Button class="mb-4" href="/school/new/">Create a school file</Button>
			<div>
				<A href="/data/schools/">List of schools</A>
			</div>
		</TabItem>
	</Tabs>
</div>
