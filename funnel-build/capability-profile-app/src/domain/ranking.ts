import type { MatchResult } from '../types/explorer';

export const rankResults = (results: MatchResult[]) => [...results].sort((a, b) => b.score - a.score || a.productId.localeCompare(b.productId));
