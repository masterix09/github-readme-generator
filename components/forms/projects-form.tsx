"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectsSchema, type Projects } from "@/lib/validation/schemas";
import { saveProjects } from "@/lib/actions/form-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PROGRAMMING_LANGUAGES } from "@/lib/validation/constants";
import { useRouter } from "next/navigation";
import { readFromStorage, saveToStorage } from "@/utils/storage";
import type { FormData } from "@/lib/validation/schemas";

interface ProjectsFormProps {
  initialData?: Projects;
  onNext: string;
  onBack: string;
}

export function ProjectsForm({
  initialData,
  onNext,
  onBack,
}: ProjectsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Projects>({
    resolver: zodResolver(projectsSchema),
    defaultValues: initialData || { projects: [] },
  });

  useEffect(() => {
    const stored = readFromStorage<FormData>();
    if (stored?.projects) {
      reset(stored.projects);
    }
  }, [reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  const onSubmit = async (data: Projects) => {
    setIsSubmitting(true);
    try {
      const result = await saveProjects(data);
      if (result.success) {
        saveToStorage<FormData>({ projects: data } as Partial<FormData>);
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

  const addProject = () => {
    if (fields.length < 5) {
      append({
        name: "",
        description: "",
        link: "",
        languages: [],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields.map((field, index) => (
        <Card key={field.id} className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Progetto {index + 1}</h3>
            {fields.length > 0 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome del Progetto *</label>
              <Input
                placeholder="Nome del progetto"
                {...register(`projects.${index}.name`)}
              />
              {errors.projects?.[index]?.name && (
                <p className="text-sm text-red-500">
                  {errors.projects[index]?.name?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrizione *</label>
              <Textarea
                placeholder="Descrivi il progetto, le tecnologie utilizzate e il tuo ruolo..."
                rows={3}
                {...register(`projects.${index}.description`)}
              />
              {errors.projects?.[index]?.description && (
                <p className="text-sm text-red-500">
                  {errors.projects[index]?.description?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Link del Progetto</label>
              <Input
                type="url"
                placeholder="https://github.com/username/project"
                {...register(`projects.${index}.link`)}
              />
              {errors.projects?.[index]?.link && (
                <p className="text-sm text-red-500">
                  {errors.projects[index]?.link?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Linguaggi Utilizzati *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {PROGRAMMING_LANGUAGES.map((language) => (
                  <label
                    key={language}
                    className="flex items-center space-x-2 cursor-pointer p-2 rounded-md border hover:bg-accent"
                  >
                    <input
                      type="checkbox"
                      value={language}
                      {...register(`projects.${index}.languages`)}
                      className="rounded"
                    />
                    <span className="text-sm">{language}</span>
                  </label>
                ))}
              </div>
              {errors.projects?.[index]?.languages && (
                <p className="text-sm text-red-500">
                  {errors.projects[index]?.languages?.message}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}

      {fields.length < 5 && (
        <Button
          type="button"
          variant="outline"
          onClick={addProject}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi Progetto
        </Button>
      )}

      {errors.projects && (
        <p className="text-sm text-red-500">{errors.projects.message}</p>
      )}

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
