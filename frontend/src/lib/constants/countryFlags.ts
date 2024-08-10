const countryFlags: { [key: string]: string } = {
	Afghanistan: '🇦🇫',
	Albania: '🇦🇱',
	Algeria: '🇩🇿',
	Andorra: '🇦🇩',
	Angola: '🇦🇴',
	'Antigua and Barbuda': '🇦🇬',
	Argentina: '🇦🇷',
	Armenia: '🇦🇲',
	Australia: '🇦🇺',
	Austria: '🇦🇹',
	Azerbaijan: '🇦🇿',
	Bahamas: '🇧🇸',
	Bahrain: '🇧🇭',
	Bangladesh: '🇧🇩',
	Barbados: '🇧🇧',
	Belarus: '🇧🇾',
	Belgium: '🇧🇪',
	Belize: '🇧🇿',
	Benin: '🇧🇯',
	Bhutan: '🇧🇹',
	Bolivia: '🇧🇴',
	'Bosnia and Herzegovina': '🇧🇦',
	Botswana: '🇧🇼',
	Brazil: '🇧🇷',
	Brunei: '🇧🇳',
	Bulgaria: '🇧🇬',
	'Burkina Faso': '🇧🇫',
	Burundi: '🇧🇮',
	Cambodia: '🇰🇭',
	Cameroon: '🇨🇲',
	Canada: '🇨🇦',
	'Cape Verde': '🇨🇻',
	'Central African Republic': '🇨🇫',
	Chad: '🇹🇩',
	Chile: '🇨🇱',
	China: '🇨🇳',
	Colombia: '🇨🇴',
	Comoros: '🇰🇲',
	'Costa Rica': '🇨🇷',
	Croatia: '🇭🇷',
	Cuba: '🇨🇺',
	Cyprus: '🇨🇾',
	'Czech Republic': '🇨🇿',
	'Democratic Republic of the Congo': '🇨🇩',
	Denmark: '🇩🇰',
	Djibouti: '🇩🇯',
	Dominica: '🇩🇲',
	'Dominican Republic': '🇩🇴',
	'East Timor': '🇹🇱',
	Ecuador: '🇪🇨',
	Egypt: '🇪🇬',
	'El Salvador': '🇸🇻',
	'Equatorial Guinea': '🇬🇶',
	Eritrea: '🇪🇷',
	Estonia: '🇪🇪',
	Eswatini: '🇸🇿',
	Ethiopia: '🇪🇹',
	Fiji: '🇫🇯',
	Finland: '🇫🇮',
	France: '🇫🇷',
	Gabon: '🇬🇦',
	Gambia: '🇬🇲',
	Georgia: '🇬🇪',
	Germany: '🇩🇪',
	Ghana: '🇬🇭',
	Greece: '🇬🇷',
	Grenada: '🇬🇩',
	Guatemala: '🇬🇹',
	Guinea: '🇬🇳',
	'Guinea-Bissau': '🇬🇼',
	Guyana: '🇬🇾',
	Haiti: '🇭🇹',
	Honduras: '🇭🇳',
	'Hong Kong': '🇭🇰',
	Hungary: '🇭🇺',
	Iceland: '🇮🇸',
	India: '🇮🇳',
	Indonesia: '🇮🇩',
	Iran: '🇮🇷',
	Iraq: '🇮🇶',
	Ireland: '🇮🇪',
	Israel: '🇮🇱',
	Italy: '🇮🇹',
	'Ivory Coast': '🇨🇮',
	Jamaica: '🇯🇲',
	Japan: '🇯🇵',
	Jordan: '🇯🇴',
	Kazakhstan: '🇰🇿',
	Kenya: '🇰🇪',
	Kiribati: '🇰🇮',
	Kuwait: '🇰🇼',
	Kyrgyzstan: '🇰🇬',
	Laos: '🇱🇦',
	Latvia: '🇱🇻',
	Lebanon: '🇱🇧',
	Lesotho: '🇱🇸',
	Liberia: '🇱🇷',
	Libya: '🇱🇾',
	Liechtenstein: '🇱🇮',
	Lithuania: '🇱🇹',
	Luxembourg: '🇱🇺',
	Macau: '🇲🇴',
	Madagascar: '🇲🇬',
	Malawi: '🇲🇼',
	Malaysia: '🇲🇾',
	Maldives: '🇲🇻',
	Mali: '🇲🇱',
	Malta: '🇲🇹',
	'Marshall Islands': '🇲🇭',
	Mauritania: '🇲🇷',
	Mauritius: '🇲🇺',
	Mexico: '🇲🇽',
	Micronesia: '🇫🇲',
	Moldova: '🇲🇩',
	Monaco: '🇲🇨',
	Mongolia: '🇲🇳',
	Montenegro: '🇲🇪',
	Morocco: '🇲🇦',
	Mozambique: '🇲🇿',
	Myanmar: '🇲🇲',
	Namibia: '🇳🇦',
	Nauru: '🇳🇷',
	Nepal: '🇳🇵',
	Netherlands: '🇳🇱',
	'New Zealand': '🇳🇿',
	Nicaragua: '🇳🇮',
	Niger: '🇳🇪',
	Nigeria: '🇳🇬',
	'North Korea': '🇰🇵',
	'North Macedonia': '🇲🇰',
	Norway: '🇳🇴',
	Oman: '🇴🇲',
	Pakistan: '🇵🇰',
	Palau: '🇵🇼',
	Palestine: '🇵🇸',
	Panama: '🇵🇦',
	'Papua New Guinea': '🇵🇬',
	Paraguay: '🇵🇾',
	Peru: '🇵🇪',
	Philippines: '🇵🇭',
	Poland: '🇵🇱',
	Portugal: '🇵🇹',
	'Puerto Rico': '🇵🇷',
	Qatar: '🇶🇦',
	'Republic of the Congo': '🇨🇬',
	Romania: '🇷🇴',
	Russia: '🇷🇺',
	Rwanda: '🇷🇼',
	'Saint Kitts and Nevis': '🇰🇳',
	'Saint Lucia': '🇱🇨',
	'Saint Vincent and the Grenadines': '🇻🇨',
	Samoa: '🇼🇸',
	'San Marino': '🇸🇲',
	'São Tomé and Príncipe': '🇸🇹',
	'Saudi Arabia': '🇸🇦',
	Senegal: '🇸🇳',
	Serbia: '🇷🇸',
	Seychelles: '🇸🇨',
	'Sierra Leone': '🇸🇱',
	Singapore: '🇸🇬',
	Slovakia: '🇸🇰',
	Slovenia: '🇸🇮',
	'Solomon Islands': '🇸🇧',
	Somalia: '🇸🇴',
	'South Africa': '🇿🇦',
	'South Korea': '🇰🇷',
	'South Sudan': '🇸🇸',
	Spain: '🇪🇸',
	'Sri Lanka': '🇱🇰',
	Sudan: '🇸🇩',
	Suriname: '🇸🇷',
	Sweden: '🇸🇪',
	Switzerland: '🇨🇭',
	Syria: '🇸🇾',
	Taiwan: '🇹🇼',
	Tajikistan: '🇹🇯',
	Tanzania: '🇹🇿',
	Thailand: '🇹🇭',
	Togo: '🇹🇬',
	Tonga: '🇹🇴',
	'Trinidad and Tobago': '🇹🇹',
	Tunisia: '🇹🇳',
	Turkey: '🇹🇷',
	Turkmenistan: '🇹🇲',
	Tuvalu: '🇹🇻',
	Uganda: '🇺🇬',
	Ukraine: '🇺🇦',
	'United Arab Emirates': '🇦🇪',
	'United Kingdom': '🇬🇧',
	'United States': '🇺🇸',
	Uruguay: '🇺🇾',
	Uzbekistan: '🇺🇿',
	Vanuatu: '🇻🇺',
	'Vatican City': '🇻🇦',
	Venezuela: '🇻🇪',
	Vietnam: '🇻🇳',
	Yemen: '🇾🇪',
	Zambia: '🇿🇲',
	Zimbabwe: '🇿🇼'
};

export default countryFlags;

export function sortUnitedStatesFirst(a: string, b: string) {
	if (a === 'United States') {
		return -1;
	} else if (b === 'United States') {
		return 1;
	} else {
		return a.localeCompare(b);
	}
}

export function sortChinaUnitedStatesFirst(a: string, b: string) {
	if (a === 'China') {
		return -1;
	} else if (b === 'China') {
		return 1;
	} else if (a === 'United States') {
		return -1;
	} else if (b === 'United States') {
		return 1;
	} else {
		return a.localeCompare(b);
	}
}

enum MostApplied {
	'China',
	'United States',
	'United Kingdom',
	'Australia',
	'Canada',
	'Hong Kong',
	'Singapore'
}

export function sortMostAppliedFirst(a: string, b: string) {
	const index = (country: string): number => {
		if (country in MostApplied) {
			return MostApplied[country as keyof typeof MostApplied];
		} else {
			return 99;
		}
	};

	const indexDiff = index(a) - index(b);
	if (indexDiff) {
		return indexDiff;
	} else {
		return a.localeCompare(b);
	}
}
