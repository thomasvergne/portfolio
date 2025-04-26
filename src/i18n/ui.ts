export const ui = {
	en: {
		navbar: {
			links: {
				projects: "Projects",
				blog: "Articles",
				contact: "Contact",
			},
		},
		header:
			"Hey, I'm a web developer based in France. I've been passionate about coding for over 7 years now.",

		carousel: {
			button: "Visit the website",
			lca: {
				title: "La Couture d'Amandine",
				description: "A description of La Couture d'Amandine.",
			},

			ledonvert: {
				title: "Le Don Vert",
				description: "A description of Le Don Vert.",
			},

			numa: {
				title: "Numa",
				description: "A description of Numa.",
			},
		},

		articles: {
			title: "My articles",
			description:
				"A selection of articles I've written about programming languages, illustrated with code examples.",
			readMore: "Read more",
			read: "Read this article",
		},

		contact: {
			title: "Contact me",

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
		navbar: {
			links: {
				projects: "Projets",
				blog: "Articles",
				contact: "Contact",
			},
		},
		header:
			"Salut, je suis un développeur web basé en France. Je suis passionné par le code depuis maintenant plus de 7 ans.",

		carousel: {
			button: "Visiter le site",
			lca: {
				title: "La Couture d'Amandine",
				description: "Une description de la couture d'Amandine.",
			},

			ledonvert: {
				title: "Le Don Vert",
				description: "Une description du Don Vert.",
			},

			numa: {
				title: "Numa",
				description: "Une description de Numa.",
			},
		},

		articles: {
			title: "Mes articles",
			description:
				"Une sélection d'articles que j'ai écrits sur les langages de programmation, illustrés par des exemples de code.",
			readMore: "En savoir plus",
			read: "Lire cet article",
		},

		contact: {
			title: "Me contacter",

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
