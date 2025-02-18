<script lang="ts">
	export let data;

	const { username, userId } = data;
</script>

<div class="flex flex-col gap-8">
	<pre class="bg-stone-50 text-sm">{JSON.stringify({ username, userId }, null, 2)}</pre>

	<a href="/student/new" class="text-sm">New student</a>

	<a href="/school/new" class="text-sm">New school</a>
</div>
