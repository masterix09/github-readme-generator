import { getFormData } from "@/lib/actions/form-actions";
import { ProjectsForm } from "@/components/forms/projects-form";
import FormWrapper from "@/components/forms/form-wrapper";

export default async function ProjectsPage() {
  const formData = await getFormData();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Progetti
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Aggiungi i tuoi progetti principali
          </p>
        </div>

        <FormWrapper title={"Progetti"} description={"Aggiungi i tuoi progetti principali (massimo 5 progetti)"}>
          <ProjectsForm
            initialData={formData.projects}
            onNext={"/extras"}
            onBack={"/skills"}
          />
        </FormWrapper>
      </div>
    </div>
  );
}
