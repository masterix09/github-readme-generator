"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { socialLinksSchema, type SocialLinks } from "@/lib/validation/schemas";
import { saveSocialLinks } from "@/lib/actions/form-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  Github,
  Linkedin,
  Globe,
  Twitter,
  Coffee,
  Youtube,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { readFromStorage, saveToStorage } from "@/utils/storage";
import type { FormData } from "@/lib/validation/schemas";

interface SocialLinksFormProps {
  initialData?: SocialLinks;
  onNext: string;
  onBack: string;
}

export function SocialLinksForm({
  initialData,
  onNext,
  onBack,
}: SocialLinksFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SocialLinks>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    const stored = readFromStorage<FormData>();
    if (stored?.socialLinks) {
      reset(stored.socialLinks);
    }
  }, [reset]);

  const onSubmit = async (data: SocialLinks) => {
    setIsSubmitting(true);
    try {
      const result = await saveSocialLinks(data);
      if (result.success) {
        saveToStorage<FormData>({ socialLinks: data } as Partial<FormData>);
        router.push(onNext);
      } else {
        console.error("Errore nel salvataggio:", result.error);
      }
    } catch (error) {
      console.error("Errore:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialFields = [
    {
      key: "github" as keyof SocialLinks,
      label: "GitHub",
      placeholder: "https://github.com/username",
      icon: Github,
    },
    {
      key: "linkedin" as keyof SocialLinks,
      label: "LinkedIn",
      placeholder: "https://linkedin.com/in/username",
      icon: Linkedin,
    },
    {
      key: "portfolio" as keyof SocialLinks,
      label: "Portfolio",
      placeholder: "https://tuoportfolio.com",
      icon: Globe,
    },
    {
      key: "twitter" as keyof SocialLinks,
      label: "Twitter",
      placeholder: "https://twitter.com/username",
      icon: Twitter,
    },
    {
      key: "devto" as keyof SocialLinks,
      label: "Dev.to",
      placeholder: "https://dev.to/username",
      icon: Globe,
    },
    {
      key: "youtube" as keyof SocialLinks,
      label: "YouTube",
      placeholder: "https://youtube.com/@username",
      icon: Youtube,
    },
    {
      key: "coffee" as keyof SocialLinks,
      label: "Buy Me a Coffee",
      placeholder: "https://buymeacoffee.com/username",
      icon: Coffee,
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {socialFields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key} className="space-y-2">
              <label
                htmlFor={field.key}
                className="text-sm font-medium flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {field.label}
              </label>
              <Input
                id={field.key}
                type="url"
                placeholder={field.placeholder}
                {...register(field.key)}
              />
              {errors[field.key] && (
                <p className="text-sm text-red-500">
                  {errors[field.key]?.message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(onBack)}
        >
          Indietro
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Avanti"}
        </Button>
      </div>
    </form>
  );
}
