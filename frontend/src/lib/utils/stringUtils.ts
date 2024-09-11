const startsWithCjk = (s: string) => s.charCodeAt(0) >= 19968;

export function lexicalChineseLast(a: string, b: string): number {
	if (startsWithCjk(a) && startsWithCjk(b)) {
		return a.localeCompare(b, 'zh-CN');
	} else {
		return a.localeCompare(b, 'en-US-u-kf-upper');
	}
}

export function splitAtChineseRuns(input: string): string[] {
	return input.split(/([\u4E00-\u9FFF]+)/g).filter(Boolean);
}
