import {defineField, defineType} from 'sanity'
import {portableTextBlock} from './portableTextBlock'

export default defineType({
  name: 'billedeTekstBlok',
  title: 'Billede og tekst',
  type: 'object',
  fields: [
    defineField({
      name: 'billede',
      title: 'Billede',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          description: 'Beskriv billedet kort. Vigtigt for SEO og skærmlæsere.',
          type: 'string',
        }),
        defineField({
          name: 'visning',
          title: 'Visning',
          description:
            'Kvadratisk beskærer billedet til et kvadrat. Fuld størrelse viser hele billedet i dets eget højde-bredde-forhold.',
          type: 'string',
          options: {
            list: [
              {title: 'Kvadratisk', value: 'kvadratisk'},
              {title: 'Fuld størrelse', value: 'fuld'},
            ],
            layout: 'radio',
          },
          initialValue: 'kvadratisk',
        }),
      ],
    }),
    defineField({
      name: 'tekst',
      title: 'Tekst',
      description:
        'Marker tekst og brug værktøjslinjen til at ændre skriftstørrelse, formatere, lave lister og tilføje links.',
      type: 'array',
      of: [portableTextBlock],
    }),
    defineField({
      name: 'kontaktKnapper',
      title: 'Vis "Kontakt" og "Ring" knapper',
      description:
        'Tilføjer en udfyldt "Kontakt"-knap (link til e-mail) og en "Ring"-knap (link til telefonnummer) under teksten. Henter e-mail og telefonnummer fra Footer-dokumentet.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'billedePosition',
      title: 'Billedets placering',
      description: 'Hvilken side billedet vises i. Teksten vises i den anden side.',
      type: 'string',
      options: {
        list: [
          {title: 'Venstre', value: 'left'},
          {title: 'Højre', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
  ],
  preview: {
    select: {media: 'billede', body: 'tekst'},
    prepare: ({media, body}) => {
      const firstBlock = Array.isArray(body)
        ? body.find((block: {_type?: string}) => block._type === 'block')
        : undefined
      const text =
        firstBlock?.children
          ?.map((child: {text?: string}) => child.text)
          .join('')
          .trim() ?? ''
      return {
        title: text ? (text.length > 60 ? `${text.slice(0, 60)}…` : text) : 'Billede og tekst',
        media,
      }
    },
  },
})
