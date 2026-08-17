import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'kontakt',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Overskrift',
      initialValue: 'Kontakt',
      type: 'string',
    }),
    defineField({
      name: 'connectHeading',
      title: 'Overskrift (connect)',
      initialValue: 'Connect',
      type: 'string',
    }),
    defineField({
      name: 'navn',
      title: 'Navn',
      type: 'string',
    }),
    defineField({
      name: 'cvr',
      title: 'CVR',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
    }),
  ],
})
