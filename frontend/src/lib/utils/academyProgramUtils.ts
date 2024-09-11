import { lexicalChineseLast } from '$lib/utils/stringUtils';

export function orderByCategoryName(
	a: { name: string; category: string },
	b: { name: string; category: string }
): number {
	if (a.category === b.category) {
		return lexicalChineseLast(a.name, b.name);
	} else {
		return a.category.localeCompare(b.category);
	}
}
