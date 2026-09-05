import { Fragment, type ReactNode } from 'react';

/**
 * Grammar strings in the content JSON carry <b> and <i> and nothing else.
 * They are parsed into real elements rather than injected as HTML, so a typo
 * in the content can never turn into markup the browser executes.
 * Anything that is not one of those two tags stays literal text.
 */
const TAG = /<(b|i)>([\s\S]*?)<\/\1>/g;

function decode(text: string): string {
  return text.replace(/&nbsp;/g, ' ').replace(/&middot;/g, '·').replace(/&amp;/g, '&');
}

export function RichText({ text }: { text: string }) {
  const source = decode(text);
  const parts: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  TAG.lastIndex = 0;
  let match = TAG.exec(source);

  while (match) {
    if (match.index > cursor) parts.push(source.slice(cursor, match.index));

    const Tag = match[1] as 'b' | 'i';
    parts.push(<Tag key={`t${key++}`}>{match[2]}</Tag>);

    cursor = match.index + match[0].length;
    match = TAG.exec(source);
  }

  if (cursor < source.length) parts.push(source.slice(cursor));

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>{part}</Fragment>
      ))}
    </>
  );
}
