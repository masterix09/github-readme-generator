"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillsSchema, type Skills } from "@/lib/validation/schemas";
import { saveSkills } from "@/lib/actions/form-actions";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  PROGRAMMING_LANGUAGES,
  FRAMEWORKS,
  TOOLS,
  DATABASES,
  OPERATING_SYSTEMS,
} from "@/lib/validation/constants";
import { useRouter } from "next/navigation";
import { readFromStorage, saveToStorage } from "@/utils/storage";
import type { FormData } from "@/lib/validation/schemas";

interface SkillsFormProps {
  initialData?: Skills;
  onNext: string;
  onBack: string;
}

export function SkillsForm({ initialData, onNext, onBack }: SkillsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Skills>({
    resolver: zodResolver(skillsSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    const stored = readFromStorage<FormData>();
    if (stored?.skills) {
      reset(stored.skills);
    }
  }, [reset]);

  const watchedLanguages = watch("languages") || [];
  const watchedFrameworks = watch("frameworks") || [];
  const watchedTools = watch("tools") || [];
  const watchedDatabases = watch("databases") || [];
  const watchedOperatingSystems = watch("operatingSystems") || [];

  const toggleArrayValue = (
    array: string[],
    value: string,
    setArray: (value: string[]) => void
  ) => {
    if (array.includes(value)) {
      setArray(array.filter((item) => item !== value));
    } else {
      setArray([...array, value]);
    }
  };

  const onSubmit = async (data: Skills) => {
    setIsSubmitting(true);
    try {
      const result = await saveSkills(data);
      if (result.success) {
        saveToStorage<FormData>({ skills: data } as Partial<FormData>);
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

  const SkillSelector = ({
    title,
    options,
    selected,
    onToggle,
  }: {
    title: string;
    options: string[];
    selected: string[];
    onToggle: (value: string) => void;
  }) => (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {options.map((option, idx) => (
          <label
            key={`${option}-${idx}`}
            className="flex items-center space-x-2 cursor-pointer p-2 rounded-md border hover:bg-accent"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="rounded"
            />
            <span className="text-sm">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <SkillSelector
        title="Linguaggi di Programmazione *"
        options={PROGRAMMING_LANGUAGES}
        selected={watchedLanguages}
        onToggle={(value) =>
          toggleArrayValue(watchedLanguages, value, (newArray) =>
            setValue("languages", newArray)
          )
        }
      />
      {errors.languages && (
        <p className="text-sm text-red-500">{errors.languages.message}</p>
      )}

      <SkillSelector
        title="Framework e Librerie"
        options={FRAMEWORKS}
        selected={watchedFrameworks}
        onToggle={(value) =>
          toggleArrayValue(watchedFrameworks, value, (newArray) =>
            setValue("frameworks", newArray)
          )
        }
      />

      <SkillSelector
        title="Strumenti"
        options={TOOLS}
        selected={watchedTools}
        onToggle={(value) =>
          toggleArrayValue(watchedTools, value, (newArray) =>
            setValue("tools", newArray)
          )
        }
      />

      <SkillSelector
        title="Database"
        options={DATABASES}
        selected={watchedDatabases}
        onToggle={(value) =>
          toggleArrayValue(watchedDatabases, value, (newArray) =>
            setValue("databases", newArray)
          )
        }
      />

      <SkillSelector
        title="Sistemi Operativi"
        options={OPERATING_SYSTEMS}
        selected={watchedOperatingSystems}
        onToggle={(value) =>
          toggleArrayValue(watchedOperatingSystems, value, (newArray) =>
            setValue("operatingSystems", newArray)
          )
        }
      />

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
