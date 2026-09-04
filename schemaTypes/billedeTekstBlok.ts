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
