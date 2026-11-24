/**
 * Splits text into masked chars or words so GSAP can slide each piece up into view.
 * Target pieces with `.split-inner`.
 */
export default function SplitText({ text, by = 'chars', className = '' }) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden="true" className="inline-block whitespace-nowrap">
          {by === 'words' ? (
            <span className="split-mask"><span className="split-inner">{word}</span></span>
          ) : (
            [...word].map((ch, ci) => (
              <span key={ci} className="split-mask"><span className="split-inner">{ch}</span></span>
            ))
          )}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
