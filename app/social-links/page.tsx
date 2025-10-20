import { getFormData } from "@/lib/actions/form-actions";
import { SocialLinksForm } from "@/components/forms/social-links-form";
import FormWrapper from "@/components/forms/form-wrapper";

export default async function SocialLinksPage() {
  const formData = await getFormData();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Link Social
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Aggiungi i tuoi profili social
          </p>
        </div>

        <FormWrapper
          title={"Link Social"}
          description={
            "Aggiungi i tuoi profili social (tutti i campi sono opzionali)"
          }
        >
          <SocialLinksForm
            initialData={formData.socialLinks}
            onNext={"/skills"}
            onBack={"/"}
          />
        </FormWrapper>
      </div>
    </div>
  );
}
