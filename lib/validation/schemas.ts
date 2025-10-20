import { z } from 'zod';

// Schema per le informazioni personali
export const personalInfoSchema = z.object({
  name: z.string().min(2, 'Il nome deve essere di almeno 2 caratteri'),
  title: z.string().min(2, 'Il titolo deve essere di almeno 2 caratteri'),
  bio: z.string().min(10, 'La bio deve essere di almeno 10 caratteri'),
  location: z.string().optional(),
  email: z.string().email('Inserisci un indirizzo email valido').optional(),
});

// Schema per i social links
export const socialLinksSchema = z.object({
  github: z.string().url('Inserisci un URL GitHub valido').optional().or(z.literal('')),
  linkedin: z.string().url('Inserisci un URL LinkedIn valido').optional().or(z.literal('')),
  portfolio: z.string().url('Inserisci un URL portfolio valido').optional().or(z.literal('')),
  twitter: z.string().url('Inserisci un URL Twitter valido').optional().or(z.literal('')),
  devto: z.string().url('Inserisci un URL Dev.to valido').optional().or(z.literal('')),
  youtube: z.string().url('Inserisci un URL YouTube valido').optional().or(z.literal('')),
  coffee: z.string().url('Inserisci un URL Buy Me a Coffee valido').optional().or(z.literal('')),
});

// Schema per le competenze
export const skillsSchema = z.object({
  languages: z.array(z.string()).min(1, 'Seleziona almeno un linguaggio'),
  frameworks: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
  databases: z.array(z.string()).optional(),
  operatingSystems: z.array(z.string()).optional(),
});

// Schema per i progetti
export const projectSchema = z.object({
  name: z.string().min(2, 'Il nome del progetto deve essere di almeno 2 caratteri'),
  description: z.string().min(10, 'La descrizione deve essere di almeno 10 caratteri'),
  link: z.string().url('Inserisci un URL valido').optional().or(z.literal('')),
  languages: z.array(z.string()).min(1, 'Seleziona almeno un linguaggio per il progetto'),
});

export const projectsSchema = z.object({
  projects: z.array(projectSchema).max(5, 'Puoi aggiungere massimo 5 progetti'),
});

// Schema per le opzioni extra
export const extrasSchema = z.object({
  showStats: z.boolean().optional().default(true),
  showTopLanguages: z.boolean().optional().default(true),
  showStreak: z.boolean().optional().default(true),
  showProfileViews: z.boolean().optional().default(true),
  theme: z.enum(['default', 'dark', 'radical', 'merko', 'gruvbox', 'tokyonight', 'onedark', 'cobalt', 'synthwave', 'highcontrast', 'dracula']).optional().default('default'),
  learning: z.string().optional(),
  collaborations: z.string().optional(),
  funFact: z.string().optional(),
  quote: z.string().optional(),
});

// Schema completo del form
export const formDataSchema = z.object({
  personalInfo: personalInfoSchema,
  socialLinks: socialLinksSchema,
  skills: skillsSchema,
  projects: projectsSchema,
  extras: extrasSchema,
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type SocialLinks = z.infer<typeof socialLinksSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Projects = z.infer<typeof projectsSchema>;
export type Extras = z.infer<typeof extrasSchema>;
export type FormData = z.infer<typeof formDataSchema>;
