export function lexicalChineseLast(a: string, b: string): number {
	if (!a) {
		return -1;
	}
	if (!b) {
		return 1;
	}
	if (a.charCodeAt(0) < 19968 || b.charCodeAt(0) < 19968) {
		return a.localeCompare(b);
	} else {
		return a.localeCompare(b, 'zh-CN');
	}
}
