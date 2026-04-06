/** Remove emoji and other non-Latin characters that standard PDF fonts cannot render */
export function stripEmoji(str: string): string {
  return str
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')   // Most emoji blocks
    .replace(/[\u{2600}-\u{27BF}]/gu, '')      // Misc symbols, dingbats
    .replace(/[\u{FE00}-\u{FEFF}]/gu, '')      // Variation selectors
    .replace(/\s{2,}/g, ' ')                   // Collapse double spaces left by removed emoji
    .trim();
}
