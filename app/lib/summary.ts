export function cleanSummary(raw: string, title: string): string {
  let s = raw.trim();
  // strip leading title that was baked into the summary field
  if (s.startsWith(title)) {
    s = s.slice(title.length).replace(/^[\s　\r\n]+/, '');
  }
  // collapse multiple whitespace chars into a single space
  s = s.replace(/[ \t　]+/g, ' ').trim();
  // truncate at sentence boundary ≤ 80 chars
  if (s.length > 80) {
    const chunk = s.slice(0, 80);
    const last = Math.max(
      chunk.lastIndexOf('。'),
      chunk.lastIndexOf('！'),
      chunk.lastIndexOf('？'),
      chunk.lastIndexOf('，'),
    );
    s = last > 20 ? s.slice(0, last + 1) + '……' : chunk + '……';
  }
  return s || title;
}
