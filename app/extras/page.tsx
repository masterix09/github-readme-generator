import { getFormData } from "@/lib/actions/form-actions";
import { ExtrasForm } from "@/components/forms/extras-form";
import FormWrapper from "@/components/forms/form-wrapper";

export default async function ExtrasPage() {
  const formData = await getFormData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Opzioni Aggiuntive
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Personalizza le statistiche e aggiungi sezioni extra
          </p>
        </div>

        <FormWrapper
          title={"Opzioni Aggiuntive"}
          description={
            "Personalizza le statistiche GitHub e aggiungi informazioni extra"
          }
        >
          <ExtrasForm
            initialData={formData.extras}
            onNext={"/preview"}
            onBack={"/projects"}
          />
        </FormWrapper>
      </div>
    </div>
  );
}
