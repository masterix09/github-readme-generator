"use client";

import { useEffect, useMemo, useState } from 'react';
import { ReadmePreview } from '@/components/preview/readme-preview';
import { generateMarkdown } from '@/utils/generateMarkdown';
import { formDataSchema, type FormData } from '@/lib/validation/schemas';
import { readFromStorage } from '@/utils/storage';
import { useRouter } from 'next/navigation';

export default function PreviewPage() {
  const router = useRouter();
  const [stored, setStored] = useState<FormData | null>(null);

  useEffect(() => {
    const data = readFromStorage<FormData>();
    setStored(data);
  }, []);

  const markdown = useMemo(() => {
    if (!stored) return '';
    try {
      const validated = formDataSchema.parse(stored);
      return generateMarkdown(validated);
    } catch {
      return '';
    }
  }, [stored]);

  useEffect(() => {
    if (!stored) return;
    const { personalInfo, socialLinks, skills, projects, extras } = stored;
    if (!personalInfo || !socialLinks || !skills || !projects || !extras) {
      router.replace('/');
    }
  }, [stored, router]);

  if (!stored || !markdown) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <ReadmePreview markdown={markdown} onBack="/extras" />
      </div>
    </div>
  );
}
