import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'anbefaling',
  title: 'Anbefaling',
  type: 'object',
  fields: [
    defineField({
      name: 'titel',
      title: 'Titel',
      description: 'F.eks. kundens navn eller det udførte arbejde.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tekst',
      title: 'Tekst',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stjerner',
      title: 'Stjerner',
      type: 'number',
      options: {
        list: [1, 2, 3, 4, 5],
        layout: 'radio',
      },
      initialValue: 5,
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
  ],
  preview: {
    select: {title: 'titel', stjerner: 'stjerner'},
    prepare: ({title, stjerner}) => ({
      title: title || 'Anbefaling',
      subtitle: stjerner ? '★'.repeat(stjerner) + '☆'.repeat(5 - stjerner) : undefined,
    }),
  },
})
