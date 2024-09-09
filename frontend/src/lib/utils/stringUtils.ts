const startsWithCjk = (s: string) => s.charCodeAt(0) >= 19968;

export function lexicalChineseLast(a: string, b: string): number {
	if (startsWithCjk(a) && startsWithCjk(b)) {
		return a.localeCompare(b, 'zh-CN');
	} else {
		return a.localeCompare(b, 'en-US-u-kf-upper');
	}
}
