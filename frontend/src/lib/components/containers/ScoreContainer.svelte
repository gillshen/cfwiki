<div class="flex gap-8 items-center py-4">
	<!-- negative ml to visually align the big circle vertically -->

	<div class="w-[150px] flex-none -ml-1 pt-6">
		<!-- add pt to visually align it better horizontally -->
		<slot name="header" />
	</div>

	<div class="w-full flex flex-col gap-3">
		<slot name="body" />
	</div>
</div>
