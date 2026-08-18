import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'section',
  title: 'Sektion',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      description: 'Bruges både som overskrift og som label i navigationen.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Bruges som anker-link, f.eks. #om. Genereres ud fra titlen.',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Tekst',
      description:
        'Marker tekst og brug værktøjslinjen til at ændre skriftstørrelse, gøre den fed eller kursiv.',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Lille', value: 'small'},
            {title: 'Stor', value: 'large'},
            {title: 'Meget stor', value: 'xlarge'},
          ],
          lists: [],
          marks: {
            decorators: [
              {title: 'Fed', value: 'strong'},
              {title: 'Kursiv', value: 'em'},
            ],
            annotations: [],
          },
        },
      ],
    }),
    defineField({
      name: 'images',
      title: 'Billeder',
      description:
        'Vælg ét billede for en enkelt firkant, eller flere for et boks-grid.',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'imagePosition',
      title: 'Billedplacering',
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
    select: {title: 'title', subtitle: 'slug.current'},
    prepare: ({title, subtitle}) => ({
      title: title || 'Unavngivet sektion',
      subtitle: subtitle ? `#${subtitle}` : undefined,
    }),
  },
})
