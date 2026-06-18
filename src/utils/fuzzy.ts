
export function fuzzyScore(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();

  if (!q) return 1;
  if (t === q) return 1;
  if (t.startsWith(q)) return 0.95;
  if (t.includes(q)) return 0.9;

  const tWords = t.split(/\s+/);
  const qWords = q.split(/\s+/);
  const allWordsMatch = qWords.every((qw) => tWords.some((tw) => tw.startsWith(qw)));
  if (allWordsMatch) return 0.75;

  let tIdx = 0;
  let qIdx = 0;
  let consecutive = 0;
  let lastMatchIdx = -1;

  while (tIdx < t.length && qIdx < q.length) {
    if (t[tIdx] === q[qIdx]) {
      if (tIdx === lastMatchIdx + 1) consecutive++;
      lastMatchIdx = tIdx;
      qIdx++;
    }
    tIdx++;
  }

  if (qIdx < q.length) return 0; 

  const density = q.length / t.length;
  const consecutiveRatio = consecutive / Math.max(q.length - 1, 1);
  return 0.1 + density * 0.25 + consecutiveRatio * 0.25;
}

export const FUZZY_THRESHOLD = 0.1;
