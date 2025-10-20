import { getFormData } from "@/lib/actions/form-actions";
import { SkillsForm } from "@/components/forms/skills-form";
import FormWrapper from "@/components/forms/form-wrapper";

export default async function SkillsPage() {
  const formData = await getFormData();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Competenze
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Seleziona le tue competenze tecniche
          </p>
        </div>

        <FormWrapper
          title={"Competenze"}
          description={
            "Seleziona le tue competenze tecniche (almeno un linguaggio di programmazione è richiesto)"
          }
        >
          <SkillsForm
            initialData={formData.skills}
            onNext={"/projects"}
            onBack={"/social-links"}
          />
        </FormWrapper>
      </div>
    </div>
  );
}
