export const scrollToHash = () => {
	const hash = window.location.hash;
	if (hash) {
		setTimeout(() => {
			const target = document.querySelector(hash);
			target?.scrollIntoView({ behavior: 'smooth' });
		}, 100); // Small delay to ensure DOM is ready
	}
};
