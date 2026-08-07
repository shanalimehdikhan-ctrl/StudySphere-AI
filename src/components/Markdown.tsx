import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeKatex,
          [rehypeHighlight, { detect: true, ignoreMissing: true }],
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}