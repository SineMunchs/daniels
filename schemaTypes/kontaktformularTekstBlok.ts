import {defineField, defineType} from 'sanity'
import {portableTextBlock} from './portableTextBlock'

export default defineType({
  name: 'kontaktformularTekstBlok',
  title: 'Kontaktformular og tekst',
  type: 'object',
  fields: [
    defineField({
      name: 'kontaktfelt',
      title: 'Kontaktformular',
      type: 'kontaktformularFelt',
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
      name: 'kontaktfeltPosition',
      title: 'Kontaktformularens placering',
      description: 'Hvilken side kontaktformularen vises i. Teksten vises i den anden side.',
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
    select: {heading: 'kontaktfelt.heading', body: 'tekst'},
    prepare: ({heading, body}) => {
      const firstBlock = Array.isArray(body)
        ? body.find((block: {_type?: string}) => block._type === 'block')
        : undefined
      const text =
        firstBlock?.children
          ?.map((child: {text?: string}) => child.text)
          .join('')
          .trim() ?? ''
      return {
        title: heading || 'Kontaktformular og tekst',
        subtitle: text ? (text.length > 60 ? `${text.slice(0, 60)}…` : text) : undefined,
      }
    },
  },
})
