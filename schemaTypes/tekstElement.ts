import {defineField, defineType} from 'sanity'
import {portableTextBlock} from './portableTextBlock'

export default defineType({
  name: 'tekstElement',
  title: 'Tekst',
  type: 'object',
  fields: [
    defineField({
      name: 'body',
      title: 'Tekst',
      description:
        'Marker tekst og brug værktøjslinjen til at ændre skriftstørrelse, formatere, lave lister og tilføje links.',
      type: 'array',
      of: [portableTextBlock],
    }),
    defineField({
      name: 'centreret',
      title: 'Centreret (fuld bredde)',
      description: 'Teksten fylder hele rækken og vises centreret i stedet for kun den ene side.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'baggrund',
      title: 'Baggrundsfarve',
      description:
        'Vis et baggrundsfelt bag den centrerede tekst. Slået fra lader teksten flyde direkte ind i siden uden felt eller kant.',
      type: 'boolean',
      initialValue: true,
      hidden: ({parent}) => !(parent as {centreret?: boolean})?.centreret,
    }),
  ],
  preview: {
    select: {body: 'body'},
    prepare: ({body}) => {
      const firstBlock = Array.isArray(body)
        ? body.find((block: {_type?: string}) => block._type === 'block')
        : undefined
      const text =
        firstBlock?.children
          ?.map((child: {text?: string}) => child.text)
          .join('')
          .trim() ?? ''
      return {
        title: text ? (text.length > 60 ? `${text.slice(0, 60)}…` : text) : 'Tekst',
      }
    },
  },
})
