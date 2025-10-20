import { FormData } from '@/lib/validation/schemas';

export function generateMarkdown(data: FormData): string {
  const { personalInfo, socialLinks, skills, projects, extras } = data;
  
  let markdown = `# ${personalInfo.name}\n\n`;
  
  // Sottotitolo e bio
  markdown += `## ${personalInfo.title}\n\n`;
  markdown += `${personalInfo.bio}\n\n`;
  
  // Informazioni di contatto
  if (personalInfo.location) {
    markdown += `📍 **Località:** ${personalInfo.location}\n\n`;
  }
  
  if (personalInfo.email) {
    markdown += `📧 **Email:** ${personalInfo.email}\n\n`;
  }
  
  // Social links
  const socialLinksArray = Object.entries(socialLinks)
    .filter(([_, url]) => url && url.trim() !== '')
    .map(([platform, url]) => {
      const platformNames: Record<string, string> = {
        github: 'GitHub',
        linkedin: 'LinkedIn',
        portfolio: 'Portfolio',
        twitter: 'Twitter',
        devto: 'Dev.to',
        youtube: 'YouTube',
        coffee: 'Buy Me a Coffee'
      };
      return `[${platformNames[platform]}](${url})`;
    });
  
  if (socialLinksArray.length > 0) {
    markdown += `## 🔗 Social\n\n`;
    markdown += socialLinksArray.join(' • ') + '\n\n';
  }
  
  // Helper: mappa linguaggi -> slug Devicon
  const deviconSlugMap: Record<string, string> = {
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
    java: 'java',
    htl: 'html5',
    html: 'html5',
    html5: 'html5',
    css: 'css3',
    css3: 'css3',
    scss: 'sass',
    'c#': 'csharp',
    'c++': 'cplusplus',
    c: 'c',
    go: 'go',
    rust: 'rust',
    php: 'php',
    ruby: 'ruby',
    swift: 'swift',
    kotlin: 'kotlin',
    scala: 'scala',
    r: 'r',
    dart: 'dart',
    lua: 'lua',
    haskell: 'haskell',
    clojure: 'clojure',
    elixir: 'elixir',
    'f#': 'fsharp',
    ocaml: 'ocaml',
    julia: 'julia',
    shell: 'bash',
    bash: 'bash',
    powershell: 'powershell',
    sql: 'mysql',
    aws: 'amazonwebservices',
    amazonwebservices: 'amazonwebservices',
    nextjs: 'nextjs',
    express: 'express',
    intellij: 'intellij',
    'intellij idea': 'intellij',
    intellijidea: 'intellij',
    planetscale: 'planetscale',
    windows: 'windows8',
    macos: 'apple',
    ios: 'apple'
  };

  // Alcune icone rendono meglio in versione wordmark
  const techIconVariantMap: Record<string, 'original' | 'original-wordmark'> = {
    amazonwebservices: 'original-wordmark',
    css3: 'original-wordmark',
    docker: 'original-wordmark',
    express: 'original-wordmark',
    html5: 'original-wordmark',
    mysql: 'original-wordmark',
    nodejs: 'original-wordmark',
    postgresql: 'original-wordmark',
    react: 'original-wordmark'
  };

  // Link ufficiali (competitor-style) per tecnologie comuni
  const techOfficialLinks: Record<string, string> = {
    aws: 'https://aws.amazon.com',
    amazonwebservices: 'https://aws.amazon.com',
    css3: 'https://www.w3schools.com/css/',
    docker: 'https://www.docker.com/',
    express: 'https://expressjs.com',
    figma: 'https://www.figma.com/',
    git: 'https://git-scm.com/',
    graphql: 'https://graphql.org',
    html5: 'https://www.w3.org/html/',
    javascript: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    mysql: 'https://www.mysql.com/',
    nextjs: 'https://nextjs.org/',
    nodejs: 'https://nodejs.org',
    postgresql: 'https://www.postgresql.org',
    react: 'https://reactjs.org/',
    redux: 'https://redux.js.org',
    sass: 'https://sass-lang.com',
    typescript: 'https://www.typescriptlang.org/',
    intellij: 'https://www.jetbrains.com/idea/',
    planetscale: 'https://planetscale.com',
    windows: 'https://www.microsoft.com/windows',
    macos: 'https://www.apple.com/macos/',
    ios: 'https://www.apple.com/ios/'
  };

  // Override per icone non standard su Devicon
  const techIconOverrides: Record<string, string> = {
    nextjs: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original-wordmark.svg',
    figma: 'https://www.vectorlogo.zone/logos/figma/figma-icon.svg',
    git: 'https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg',
    graphql: 'https://www.vectorlogo.zone/logos/graphql/graphql-icon.svg'
  };

  const getTechSlug = (name: string): string => {
    return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
  };

  const getTechIconUrl = (name: string): string => {
    const slug = getTechSlug(name);
    if (techIconOverrides[slug]) return techIconOverrides[slug];
    const deviconSlug = deviconSlugMap[slug] || slug;
    const variant = techIconVariantMap[deviconSlug] || 'original';
    return `https://raw.githubusercontent.com/devicons/devicon/master/icons/${deviconSlug}/${deviconSlug}-${variant}.svg`;
  };

  const getTechLink = (name: string): string | undefined => {
    const slug = getTechSlug(name);
    return techOfficialLinks[slug];
  };

  const renderTechIconAnchor = (name: string, size: number): string => {
    const href = getTechLink(name);
    const src = getTechIconUrl(name);
    const img = `<img src="${src}" alt="${name}" width="${size}" height="${size}" />`;
    if (href) {
      return `<a href="${href}" target="_blank" rel="noreferrer"> ${img} </a>`;
    }
    return img;
  };

  // Competenze
  markdown += `## 🛠️ Competenze\n\n`;
  
  if (skills.languages && skills.languages.length > 0) {
    markdown += `**Linguaggi di programmazione:**\n`;
    markdown += `<div style="display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin-top:6px;">`;
    markdown += skills.languages.map((lang) => renderTechIconAnchor(lang, 40)).join('');
    markdown += `</div>\n\n`;
  }
  
  if (skills.frameworks && skills.frameworks.length > 0) {
    markdown += `**Framework e librerie:**\n`;
    markdown += `<div style="display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin-top:6px;">`;
    markdown += skills.frameworks.map((fw) => renderTechIconAnchor(fw, 40)).join('');
    markdown += `</div>\n\n`;
  }
  
  if (skills.tools && skills.tools.length > 0) {
    markdown += `**Strumenti:**\n`;
    markdown += `<div style="display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin-top:6px;">`;
    markdown += skills.tools.map((tool) => renderTechIconAnchor(tool, 40)).join('');
    markdown += `</div>\n\n`;
  }
  
  if (skills.databases && skills.databases.length > 0) {
    markdown += `**Database:**\n`;
    markdown += `<div style="display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin-top:6px;">`;
    markdown += skills.databases.map((db) => renderTechIconAnchor(db, 40)).join('');
    markdown += `</div>\n\n`;
  }
  
  if (skills.operatingSystems && skills.operatingSystems.length > 0) {
    markdown += `**Sistemi operativi:**\n`;
    markdown += `<div style="display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin-top:6px;">`;
    markdown += skills.operatingSystems.map((os) => renderTechIconAnchor(os, 40)).join('');
    markdown += `</div>\n\n`;
  }
  
  // Progetti
  if (projects.projects && projects.projects.length > 0) {
    markdown += `## 🚀 Progetti\n\n`;
    
    projects.projects.forEach((project, index) => {
      markdown += `### ${index + 1}. ${project.name}\n\n`;
      markdown += `${project.description}\n\n`;
      
      if (project.link) {
        markdown += `🔗 [Vedi progetto](${project.link})\n\n`;
      }
      
      if (project.languages && project.languages.length > 0) {
        markdown += `**Tecnologie utilizzate:**\\\n`;
        markdown += `<div style="display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin-top:6px;">`;
        markdown += project.languages.map((lang) => renderTechIconAnchor(lang, 40)).join('');
        markdown += `</div>\n\n`;
      }
    });
  }
  
  // Sezioni extra
  if (extras.learning) {
    markdown += `## 📚 Sto imparando\n\n`;
    markdown += `${extras.learning}\n\n`;
  }
  
  if (extras.collaborations) {
    markdown += `## 🤝 Collaborazioni\n\n`;
    markdown += `${extras.collaborations}\n\n`;
  }
  
  if (extras.funFact) {
    markdown += `## 💡 Curiosità\n\n`;
    markdown += `${extras.funFact}\n\n`;
  }
  
  if (extras.quote) {
    markdown += `## 💬 Citazione\n\n`;
    markdown += `> ${extras.quote}\n\n`;
  }
  
  // GitHub Stats
  if (extras.showStats || extras.showTopLanguages || extras.showStreak || extras.showProfileViews) {
    markdown += `## 📊 Statistiche GitHub\n\n`;
    
    if (extras.showStats) {
      const githubUsername = socialLinks.github?.split('/').pop() || 'username';
      markdown += `![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=${extras.theme}&hide_border=true)\n\n`;
    }
    
    if (extras.showTopLanguages) {
      const githubUsername = socialLinks.github?.split('/').pop() || 'username';
      markdown += `![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&layout=compact&theme=${extras.theme}&hide_border=true)\n\n`;
    }
    
    if (extras.showStreak) {
      const githubUsername = socialLinks.github?.split('/').pop() || 'username';
      markdown += `![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${githubUsername}&theme=${extras.theme}&hide_border=true)\n\n`;
    }
    
    if (extras.showProfileViews) {
      const githubUsername = socialLinks.github?.split('/').pop() || 'username';
      markdown += `![Profile Views](https://komarev.com/ghpvc/?username=${githubUsername}&style=flat-square&color=blueviolet)\n\n`;
    }
  }
  
  // Footer
  markdown += `---\n\n`;
  markdown += `*README generato con ❤️ usando [GitHub README Generator](https://github-readme-generator.vercel.app)*\n`;
  
  return markdown;
}
