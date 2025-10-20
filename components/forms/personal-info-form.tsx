"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  personalInfoSchema,
  type PersonalInfo,
} from "@/lib/validation/schemas";
import { savePersonalInfo } from "@/lib/actions/form-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readFromStorage, saveToStorage } from "@/utils/storage";
import type { FormData } from "@/lib/validation/schemas";

interface PersonalInfoFormProps {
  initialData?: PersonalInfo;
  onNext: string;
}

export function PersonalInfoForm({
  initialData,
  onNext,
}: PersonalInfoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    const stored = readFromStorage<FormData>();
    if (stored?.personalInfo) {
      reset(stored.personalInfo);
    }
  }, [reset]);

  const onSubmit = async (data: PersonalInfo) => {
    setIsSubmitting(true);
    try {
      const result = await savePersonalInfo(data);
      if (result.success) {
        saveToStorage<FormData>({ personalInfo: data } as Partial<FormData>);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nome *
          </label>
          <Input id="name" placeholder="Il tuo nome" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Titolo Professionale *
          </label>
          <Input
            id="title"
            placeholder="es. Sviluppatore Full Stack"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">
          Biografia *
        </label>
        <Textarea
          id="bio"
          placeholder="Racconta qualcosa di te e delle tue competenze..."
          rows={4}
          {...register("bio")}
        />
        {errors.bio && (
          <p className="text-sm text-red-500">{errors.bio.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium">
            Località
          </label>
          <Input
            id="location"
            placeholder="es. Milano, Italia"
            {...register("location")}
          />
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="tua@email.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Avanti"}
        </Button>
      </div>
    </form>
  );
}
