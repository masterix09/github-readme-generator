'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ReadmePreviewProps {
  markdown: string;
  onBack: string;
}

export function ReadmePreview({ markdown, onBack }: ReadmePreviewProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Errore nella copia:', error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Anteprima README</CardTitle>
          <CardDescription>
            Ecco come apparirà il tuo README GitHub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={downloadMarkdown} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Scarica README.md
            </Button>
            <Button 
              variant="outline" 
              onClick={copyToClipboard}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copiato!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copia negli appunti
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => router.push(onBack)}>
              Modifica
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
                  
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                  style={{ display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }}
                    {...props}
                    alt={props.alt ?? ''}
                  />
                ),
                h1: ({ ...props }) => (
                  <h1 {...props} className="text-4xl font-extrabold tracking-tight" />
                ),
                h2: ({ ...props }) => (
                  <h2 {...props} className="text-2xl font-bold tracking-tight mt-8" />
                ),
                h3: ({ ...props }) => (
                  <h3 {...props} className="text-xl font-semibold mt-6" />
                ),
                p: ({ ...props }) => (
                  <p {...props} className="leading-7" />
                ),
                a: ({ ...props }) => (
                  <a {...props} className="text-primary underline underline-offset-4" />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote {...props} className="border-l-4 pl-4 italic opacity-90" />
                )
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
