export function formatDateFull(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().padStart(2, "0");
  return `${day}${month}${year}`;
}

export function formatDateMonthYear(date: Date): string {
  return formatDateFull(date).substr(2);
}

export function formatBool(val: boolean): string {
  return (+val).toString();
}

export function formatBoolNeg(val: boolean): string {
  return (+!val).toString();
}

/**
 * Checks whether the given iban is valid
 * @param iban Iban to verify
 */
export function isValidIBANNumber(iban: string) {
  const CODE_LENGTHS = {
    AD: 24, AE: 23, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
    CH: 21, CR: 21, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24,
    FI: 18, FO: 18, FR: 27, GB: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21,
    HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
    LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27,
    MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
    RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26,
    AL: 28, BY: 28, EG: 29, GE: 22, IQ: 23, LC: 32, SC: 31, ST: 25, SV: 28,
    TL: 23, UA: 29, VA: 22, VG: 24, XK: 20
  };

  iban = String(iban).toUpperCase().replace(/[^A-Z0-9]/g, "");
  const ibanMatch = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);
  if (!ibanMatch || iban.length !== CODE_LENGTHS[ibanMatch[1]]) {
    return false;
  }
  const checksum = +ibanMatch[2];
  const digits = +(ibanMatch[3] + (ibanMatch[1].charCodeAt(0) - 55) + (ibanMatch[1].charCodeAt(1) - 55)) * 100;

  const calculatedChecksum = 98 - digits % 97;

  return calculatedChecksum === checksum;
}
