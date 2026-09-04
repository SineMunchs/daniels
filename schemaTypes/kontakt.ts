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
      name: 'links',
      title: 'Links',
      description:
        'Tilføj de links du vil vise, f.eks. Instagram eller LinkedIn. Åbner i en ny fane.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'link',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              description: 'Fx "Instagram" eller "LinkedIn".',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'url'},
          },
        },
      ],
    }),
  ],
})
