import type { ComposedSchoolListItem, School, SchoolStats, RankingEntry } from '$lib/api/school';
import { blankStats } from '$lib/api/stats';
import { lexicalChineseLast } from '$lib/util/stringUtils';
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
	if (
		[
			'China',
			'United States',
			'United Kingdom',
			'Canada',
			'Australia',
			'Hong Kong',
			'Singapore'
		].includes(country)
	) {
		return formatRegionCity(school);
	}
	return `${formatRegionCity(school)}, ${country}`;
}

export function formatRegionCity(school: School): string {
	const { country, region, city } = school;
	if (!city) {
		return region;
	}
	if (!region || ['上海', '北京', '天津', '重庆'].includes(city)) {
		return city;
	}
	if (country === 'China') {
		return `${region} ${city}`;
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

export function getSchoolRankingEntry(params: {
	school: School;
	year?: number | undefined;
	rankingName?: string | undefined;
}): RankingEntry | null {
	const { school, year, rankingName } = params;

	const ranks = [...school.rankings].filter(
		(entry) =>
			(year === undefined || entry.year === year) &&
			(rankingName === undefined || entry.ranking_name.startsWith(rankingName))
	);

	if (!ranks.length) {
		return null;
	}

	ranks
		.sort((a, b) => (_rankingOrder[a.ranking_name] ?? 99) - (_rankingOrder[b.ranking_name] ?? 99))
		.sort((a, b) => b.year - a.year);

	return ranks[0];
}

export function formatSchoolRankingEntry(
	entry: RankingEntry | null,
	params: { showYear: boolean } = { showYear: true }
): string {
	if (!entry) {
		return '';
	}
	const rankingName: string = _abbreviateRankingName(entry.ranking_name);
	const year = params?.showYear ? `(${entry.year.toString()})` : '';

	return `${rankingName} #${entry.rank} ${year}`.trim();
}

const _abbreviateRankingName = (rankingName: string): string => {
	switch (rankingName) {
		case 'US News National Universities':
		case 'US News Liberal Arts Colleges':
			return 'US News';
		case 'QS World':
			return 'QS';
		case 'Times Higher Education':
			return 'Times';
		case 'Shanghai Ranking':
			return 'Shanghai';
		default:
			return rankingName;
	}
};

export function orderByName(a: { name: string }, b: { name: string }): number {
	return lexicalChineseLast(a.name, b.name);
}
