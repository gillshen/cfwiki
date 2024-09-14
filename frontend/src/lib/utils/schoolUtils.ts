import type { ComposedSchoolListItem, School, SchoolStats, RankingEntry } from '$lib/api/school';
import { blankStats } from '$lib/api/stats';
import americanStates from '$lib/constants/americanStates';
import canadianProvinces from '$lib/constants/canadianProvinces';

export function combineWithStats(
	schools: School[],
	stats: SchoolStats[]
): ComposedSchoolListItem[] {
	return schools.map((school) => {
		const statsItem = stats.find((s) => s.school_id === school.id);

		if (statsItem === undefined) {
			return { ...school, ug_stats: blankStats(), grad_stats: blankStats() };
		}

		const ug_stats = {
			applied: statsItem.ug_applied,
			pending: statsItem.ug_pending,
			accepted: statsItem.ug_accepted,
			denied: statsItem.ug_denied,
			neutral: statsItem.ug_neutral
		};
		const grad_stats = {
			applied: statsItem.grad_applied,
			pending: statsItem.grad_pending,
			accepted: statsItem.grad_accepted,
			denied: statsItem.grad_denied,
			neutral: statsItem.grad_neutral
		};
		return { ...school, ug_stats, grad_stats };
	});
}

export function formatLocation(school: School): string {
	const { country, region, city } = school;
	if (!country) {
		return '';
	}
	if (!region && !city) {
		return country;
	}
	return formatRegionCity(school);
}

export function formatRegionCity(school: School): string {
	const { country, region, city } = school;
	if (!city) {
		return region;
	}
	if (!region || country === 'China') {
		return city;
	}

	let regionAbbr: string;
	switch (country) {
		case 'United States':
			regionAbbr = americanStates[region];
			break;
		case 'Canada':
			regionAbbr = canadianProvinces[region];
			break;
		default:
			regionAbbr = '';
	}
	return `${city}, ${regionAbbr}`;
}

const _rankingOrder: Record<string, number> = {
	'US News National Universities': 0,
	'US News Liberal Arts Colleges': 0,
	'QS World': 1,
	'Times Higher Education': 2,
	'Shanghai Ranking': 3,
	Forbes: 4
};

export function getLatestRanking(
	school: School,
	params?: { year?: number | undefined; rankingName?: string | undefined }
): RankingEntry | null {
	let year = params?.year;
	let rankingName = params?.rankingName;

	let rankings = [...school.rankings].filter(
		(entry) =>
			(year === undefined || entry.year <= year) &&
			(rankingName === undefined || entry.ranking_name.startsWith(rankingName))
	);

	if (!rankings.length) {
		return null;
	}

	rankings
		.sort((a, b) => (_rankingOrder[a.ranking_name] ?? 99) - (_rankingOrder[b.ranking_name] ?? 99))
		.sort((a, b) => b.year - a.year);

	return rankings[0];
}

export function formatRanking(
	entry: RankingEntry | null,
	params?: { year?: boolean; rankingName?: boolean }
): string {
	if (entry === null) {
		return '';
	}

	let rankingName = '';

	if (params?.rankingName) {
		switch (entry.ranking_name) {
			case 'US News National Universities':
			case 'US News Liberal Arts Colleges':
				rankingName = 'US News';
				break;
			case 'QS World':
				rankingName = 'QS';
				break;
			case 'Times Higher Education':
				rankingName = 'Times';
				break;
			case 'Shanghai Ranking':
				rankingName = 'Shanghai';
				break;
			default:
				rankingName = entry.ranking_name;
		}
	}

	const year = params?.year ? entry.year.toString() : '';

	let nameAndYear = `${rankingName} ${year}`.trim();
	if (nameAndYear) {
		nameAndYear = ` (${nameAndYear})`;
	}

	return `${entry.rank}${nameAndYear}`;
}

export function orderByName(a: { name: string }, b: { name: string }): number {
	return a.name.localeCompare(b.name);
}
