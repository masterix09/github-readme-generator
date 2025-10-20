"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { extrasSchema, type Extras } from "@/lib/validation/schemas";
import { saveExtras } from "@/lib/actions/form-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { GITHUB_THEMES } from "@/lib/validation/constants";
import { useRouter } from "next/navigation";
import { readFromStorage, saveToStorage } from "@/utils/storage";
import type { FormData } from "@/lib/validation/schemas";

interface ExtrasFormProps {
  initialData?: Extras;
  onNext: string;
  onBack: string;
}

export function ExtrasForm({ initialData, onNext, onBack }: ExtrasFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(extrasSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    const stored = readFromStorage<FormData>();
    if (stored?.extras) {
      reset(stored.extras);
    }
  }, [reset]);

  const watchedShowStats = watch("showStats");
  const watchedShowTopLanguages = watch("showTopLanguages");
  const watchedShowStreak = watch("showStreak");
  const watchedShowProfileViews = watch("showProfileViews");

  const onSubmit = async (data: Extras) => {
    setIsSubmitting(true);
    try {
      const result = await saveExtras(data);
      if (result.success) {
        saveToStorage<FormData>({ extras: data } as Partial<FormData>);
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
      {/* Statistiche GitHub */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Statistiche GitHub</h3>

        <div className="space-y-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("showStats")}
              className="rounded"
            />
            <span>Mostra statistiche GitHub</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("showTopLanguages")}
              className="rounded"
            />
            <span>Mostra linguaggi più utilizzati</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("showStreak")}
              className="rounded"
            />
            <span>Mostra streak GitHub</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("showProfileViews")}
              className="rounded"
            />
            <span>Mostra visualizzazioni profilo</span>
          </label>
        </div>

        {(watchedShowStats ||
          watchedShowTopLanguages ||
          watchedShowStreak ||
          watchedShowProfileViews) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Tema per le statistiche
            </label>
            <select
              {...register("theme")}
              className="w-full p-2 border rounded-md"
            >
              {GITHUB_THEMES.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Sezioni extra */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sezioni Aggiuntive</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Cosa stai imparando</label>
          <Input
            placeholder="es. React Native, Machine Learning..."
            {...register("learning")}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Collaborazioni</label>
          <Textarea
            placeholder="Descrivi i tuoi progetti di collaborazione..."
            rows={3}
            {...register("collaborations")}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Curiosità su di te</label>
          <Textarea
            placeholder="Una curiosità interessante su di te..."
            rows={2}
            {...register("funFact")}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Citazione preferita</label>
          <Textarea
            placeholder="Una citazione che ti ispira..."
            rows={2}
            {...register("quote")}
          />
        </div>
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
          {isSubmitting ? "Salvando..." : "Genera README"}
        </Button>
      </div>
    </form>
  );
}
