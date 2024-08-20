export const localeComparator = (
	a: string,
	b: string,
	nodeA: any,
	nodeB: any,
	isDescending: boolean
) => {
	return a.localeCompare(b, 'zh-CN');
};
