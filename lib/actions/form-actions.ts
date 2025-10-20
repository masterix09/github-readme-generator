'use server';

import { revalidatePath } from 'next/cache';
import { 
  personalInfoSchema, 
  socialLinksSchema, 
  skillsSchema, 
  projectsSchema, 
  extrasSchema,
  type PersonalInfo,
  type SocialLinks,
  type Skills,
  type Projects,
  type Extras
} from '@/lib/validation/schemas';

// Store temporaneo per i dati del form (in produzione si potrebbe usare un database)
let formData: {
  personalInfo?: PersonalInfo;
  socialLinks?: SocialLinks;
  skills?: Skills;
  projects?: Projects;
  extras?: Extras;
} = {};

export async function savePersonalInfo(data: PersonalInfo) {
  try {
    const validatedData = personalInfoSchema.parse(data);
    formData.personalInfo = validatedData;
    revalidatePath('/');
    return { success: true, data: validatedData };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Errore di validazione' 
    };
  }
}

export async function saveSocialLinks(data: SocialLinks) {
  try {
    const validatedData = socialLinksSchema.parse(data);
    formData.socialLinks = validatedData;
    revalidatePath('/');
    return { success: true, data: validatedData };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Errore di validazione' 
    };
  }
}

export async function saveSkills(data: Skills) {
  try {
    const validatedData = skillsSchema.parse(data);
    formData.skills = validatedData;
    revalidatePath('/');
    return { success: true, data: validatedData };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Errore di validazione' 
    };
  }
}

export async function saveProjects(data: Projects) {
  try {
    const validatedData = projectsSchema.parse(data);
    formData.projects = validatedData;
    revalidatePath('/');
    return { success: true, data: validatedData };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Errore di validazione' 
    };
  }
}

export async function saveExtras(data: Extras) {
  try {
    const validatedData = extrasSchema.parse(data);
    formData.extras = validatedData;
    revalidatePath('/');
    return { success: true, data: validatedData };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Errore di validazione' 
    };
  }
}

export async function getFormData() {
  return formData;
}

export async function clearFormData() {
  formData = {};
  revalidatePath('/');
}
