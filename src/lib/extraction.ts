import { parsePhoneNumberFromString } from 'libphonenumber-js';
import type { ExtractedNumber } from '@/types';

const countryFlagMap: Record<string, string> = {
  'NG': '🇳🇬', 'US': '🇺🇸', 'GB': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺',
  'ZA': '🇿🇦', 'KE': '🇰🇪', 'GH': '🇬🇭', 'UG': '🇺🇬', 'TZ': '🇹🇿',
  'RW': '🇷🇼', 'ET': '🇪🇹', 'EG': '🇪🇬', 'MA': '🇲🇦', 'TN': '🇹🇳',
  'IN': '🇮🇳', 'PK': '🇵🇰', 'BD': '🇧🇩', 'ID': '🇮🇩', 'PH': '🇵🇭',
  'MY': '🇲🇾', 'SG': '🇸🇬', 'TH': '🇹🇭', 'VN': '🇻🇳', 'CN': '🇨🇳',
  'JP': '🇯🇵', 'KR': '🇰🇷', 'DE': '🇩🇪', 'FR': '🇫🇷', 'IT': '🇮🇹',
  'ES': '🇪🇸', 'PT': '🇵🇹', 'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭',
  'AT': '🇦🇹', 'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮',
  'PL': '🇵🇱', 'CZ': '🇨🇿', 'HU': '🇭🇺', 'RO': '🇷🇴', 'BG': '🇧🇬',
  'HR': '🇭🇷', 'RS': '🇷🇸', 'UA': '🇺🇦', 'RU': '🇷🇺', 'TR': '🇹🇷',
  'AE': '🇦🇪', 'SA': '🇸🇦', 'QA': '🇶🇦', 'KW': '🇰🇼', 'BH': '🇧🇭',
  'OM': '🇴🇲', 'JO': '🇯🇴', 'LB': '🇱🇧', 'IL': '🇮🇱', 'IR': '🇮🇷',
  'BR': '🇧🇷', 'AR': '🇦🇷', 'CL': '🇨🇱', 'CO': '🇨🇴', 'PE': '🇵🇪',
  'VE': '🇻🇪', 'UY': '🇺🇾', 'PY': '🇵🇾', 'BO': '🇧🇴', 'EC': '🇪🇨',
  'MX': '🇲🇽', 'GT': '🇬🇹', 'CR': '🇨🇷', 'PA': '🇵🇦', 'HN': '🇭🇳',
  'SV': '🇸🇻', 'NI': '🇳🇮', 'CU': '🇨🇺', 'DO': '🇩🇴', 'PR': '🇵🇷',
  'JM': '🇯🇲', 'TT': '🇹🇹', 'BB': '🇧🇧', 'GD': '🇬🇩', 'LC': '🇱🇨',
  'VC': '🇻🇨', 'AG': '🇦🇬', 'KN': '🇰🇳', 'DM': '🇩🇲', 'BS': '🇧🇸',
  'BZ': '🇧🇿', 'GY': '🇬🇾', 'SR': '🇸🇷', 'GF': '🇬🇫', 'FK': '🇫🇰',
};

export function extractPhoneNumbers(text: string): ExtractedNumber[] {
  const numbers: ExtractedNumber[] = [];
  const seen = new Set<string>();
  
  // Multiple regex patterns to catch phone numbers in different formats
  const patterns = [
    // International format: +1234567890 or +1 234 567 890
    /\+\d[\d\s\-\(\)]{7,20}/g,
    // Numbers in parentheses or brackets
    /\[\+?\d[\d\s\-\(\)]{7,20}\]/g,
    // Numbers with country code in various formats
    /\b\d{1,4}[\s\-]?\d{3}[\s\-]?\d{3}[\s\-]?\d{3,4}\b/g,
  ];

  const allMatches: string[] = [];
  
  for (const pattern of patterns) {
    const matches = text.match(pattern) || [];
    allMatches.push(...matches);
  }

  for (const match of allMatches) {
    // Clean the number
    let cleaned = match
      .replace(/[\[\]\(\)\s\-]/g, '')
      .replace(/^00/, '+');
    
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }

    // Only process if we haven't seen this number
    if (seen.has(cleaned)) continue;
    seen.add(cleaned);

    try {
      const phoneNumber = parsePhoneNumberFromString(cleaned);
      if (phoneNumber && phoneNumber.isValid()) {
        const countryCode = phoneNumber.country || 'Unknown';
        const countryName = getCountryName(countryCode);
        const flag = countryFlagMap[countryCode] || '🌍';
        
        numbers.push({
          number: phoneNumber.formatInternational(),
          country: countryName,
          flag,
          isDuplicate: false,
        });
      }
    } catch {
      // Invalid number, skip
    }
  }

  return numbers;
}

function getCountryName(code: string): string {
  const names: Record<string, string> = {
    'NG': 'Nigeria', 'US': 'United States', 'GB': 'United Kingdom',
    'CA': 'Canada', 'AU': 'Australia', 'ZA': 'South Africa',
    'KE': 'Kenya', 'GH': 'Ghana', 'UG': 'Uganda', 'TZ': 'Tanzania',
    'RW': 'Rwanda', 'ET': 'Ethiopia', 'EG': 'Egypt', 'MA': 'Morocco',
    'TN': 'Tunisia', 'IN': 'India', 'PK': 'Pakistan', 'BD': 'Bangladesh',
    'ID': 'Indonesia', 'PH': 'Philippines', 'MY': 'Malaysia', 'SG': 'Singapore',
    'TH': 'Thailand', 'VN': 'Vietnam', 'CN': 'China', 'JP': 'Japan',
    'KR': 'South Korea', 'DE': 'Germany', 'FR': 'France', 'IT': 'Italy',
    'ES': 'Spain', 'PT': 'Portugal', 'NL': 'Netherlands', 'BE': 'Belgium',
    'CH': 'Switzerland', 'AT': 'Austria', 'SE': 'Sweden', 'NO': 'Norway',
    'DK': 'Denmark', 'FI': 'Finland', 'PL': 'Poland', 'CZ': 'Czech Republic',
    'HU': 'Hungary', 'RO': 'Romania', 'BG': 'Bulgaria', 'HR': 'Croatia',
    'RS': 'Serbia', 'UA': 'Ukraine', 'RU': 'Russia', 'TR': 'Turkey',
    'AE': 'UAE', 'SA': 'Saudi Arabia', 'QA': 'Qatar', 'KW': 'Kuwait',
    'BH': 'Bahrain', 'OM': 'Oman', 'JO': 'Jordan', 'LB': 'Lebanon',
    'IL': 'Israel', 'IR': 'Iran', 'BR': 'Brazil', 'AR': 'Argentina',
    'CL': 'Chile', 'CO': 'Colombia', 'PE': 'Peru', 'VE': 'Venezuela',
    'UY': 'Uruguay', 'PY': 'Paraguay', 'BO': 'Bolivia', 'EC': 'Ecuador',
    'MX': 'Mexico', 'GT': 'Guatemala', 'CR': 'Costa Rica', 'PA': 'Panama',
    'HN': 'Honduras', 'SV': 'El Salvador', 'NI': 'Nicaragua', 'CU': 'Cuba',
    'DO': 'Dominican Republic', 'PR': 'Puerto Rico', 'JM': 'Jamaica',
    'TT': 'Trinidad & Tobago', 'BB': 'Barbados', 'GD': 'Grenada',
    'LC': 'St. Lucia', 'VC': 'St. Vincent', 'AG': 'Antigua & Barbuda',
    'KN': 'St. Kitts & Nevis', 'DM': 'Dominica', 'BS': 'Bahamas',
    'BZ': 'Belize', 'GY': 'Guyana', 'SR': 'Suriname', 'GF': 'French Guiana',
    'FK': 'Falkland Islands',
  };
  return names[code] || code;
}

export function deduplicateNumbers(
  newNumbers: ExtractedNumber[],
  existingNumbers: string[]
): ExtractedNumber[] {
  const existingSet = new Set(existingNumbers.map(n => n.replace(/\s/g, '')));
  
  return newNumbers.map(num => ({
    ...num,
    isDuplicate: existingSet.has(num.number.replace(/\s/g, '')),
  }));
}
