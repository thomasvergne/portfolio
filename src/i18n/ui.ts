export const ui = {
  en: {
    toc: "Table of contents",

    navbar: {
      links: {
        projects: "Projects",
        blog: "Articles",
        contact: "Contact",
      },
    },

    header: {
      firstPart: "hey, i'm",
      secondPart: "thomas vergne",
      marquee: "web developer",
      cta: "contact me",
    },

    projects: {
      title: {
        firstPart: "some of the projects",
        secondPart: "i've worked on",
      },

      list: {
        lca: "A website for a geek, ethical and eco-responsible sewer.",
        ledonvert: "A website for a plant donation platform in whole France.",
        numa: "A website that offers an emotional agenda with AI.",
        dutoitautomobile:
          "A website for a garage specializing in 4x4 vehicles.",
      },
      cta: "view project",
    },

    articles: {
      title: {
        firstPart: "i also write articles",
        secondPart: "about everything",
      },
      description:
        "A selection of articles I've written about programming languages, illustrated with code examples.",
      readMore: "Read more",
      read: "Read this article",
    },

    contact: {
      title: {
        firstPart: "Got an idea?",
        secondPart: "Contact me",
      },

      socials: "My social networks",

      form: {
        name: "Your full name",
        email: "Your email address",
        message: "Your message",
        send: "Send message",
        subject: "Message subject",
      },

      success: {
        title: "Message sent",
        description:
          "Thank you for your message, I will respond as soon as possible.",
        button: "Return to home",
      },

      error: {
        title: "Error",
        description:
          "An error occurred while sending the message. Please try again.",
        button: "Return to home",

        missingData: {
          title: "Missing data",
          description: "Please fill in all fields of the form.",
        },

        invalidEmail: {
          title: "Invalid email address",
          description: "Please enter a valid email address.",
        },
      },

      back: "Return to home",
    },
  },

  fr: {
    toc: "Table des matières",

    navbar: {
      links: {
        projects: "Projets",
        blog: "Articles",
        contact: "Contact",
      },
    },

    header: {
      firstPart: "salut, je suis",
      secondPart: "thomas vergne",
      marquee: "développeur web",
      cta: "me contacter",
    },

    projects: {
      title: {
        firstPart: "certains des projets",
        secondPart: "auxquels j'ai participés",
      },

      list: {
        lca: "Un site pour une couturière geek, éthique et écoresponsable.",
        ledonvert: "Un site pour une plateforme de don de plantes en France.",
        numa: "Un site qui propose un agenda émotionnel avec IA.",
        dutoitautomobile: "Un site pour un garage spécialisé dans les 4x4.",
      },

      cta: "voir le projet",
    },

    articles: {
      title: {
        firstPart: "j'écris aussi des articles",
        secondPart: "à propos de tout"
      },
      description:
        "Une sélection d'articles que j'ai écrits sur les langages de programmation, illustrés par des exemples de code.",
      readMore: "En savoir plus",
      read: "Lire cet article",
    },

    contact: {
      title: {
        firstPart: "Vous avez une idée ?",
        secondPart: "Contactez-moi",
      },

      socials: "Mes réseaux sociaux",

      form: {
        name: "Votre nom et prénom",
        email: "Votre adresse e-mail",
        message: "Votre message",
        send: "Envoyer le message",
        subject: "Sujet du message",
      },

      success: {
        title: "Message envoyé",
        description:
          "Merci pour votre message, je vous répondrai dès que possible.",
        button: "Retourner à l'accueil",
      },

      error: {
        title: "Erreur",
        description:
          "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.",
        button: "Retourner à l'accueil",

        missingData: {
          title: "Données manquantes",
          description: "Veuillez remplir tous les champs du formulaire.",
        },

        invalidEmail: {
          title: "Adresse e-mail invalide",
          description: "Veuillez entrer une adresse e-mail valide.",
        },
      },

      back: "Retourner à l'accueil",
    },
  },
} as const;

export const languagesNames: Record<Languages, [string, string]> = {
	en: ["🇺🇸", "English"],
	fr: ["🇫🇷", "Français"],
};

export type Languages = keyof typeof ui;

export const defaultLang: Languages = "en";
