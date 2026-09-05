import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'billedeGalleriBlok',
  title: 'Billedegalleri',
  type: 'object',
  fields: [
    defineField({
      name: 'billeder',
      title: 'Billeder',
      description:
        'Tilføj billederne til galleriet. De vises kvadratiske, tre ad gangen, med horisontal scroll hvis der er flere end tre.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt-tekst',
              description: 'Beskriv billedet kort. Vigtigt for SEO og skærmlæsere.',
              type: 'string',
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {billeder: 'billeder'},
    prepare: ({billeder}) => ({
      title: 'Billedegalleri',
      subtitle:
        billeder && billeder.length > 0
          ? `${billeder.length} billede${billeder.length === 1 ? '' : 'r'}`
          : 'Ingen billeder endnu',
      media: billeder?.[0],
    }),
  },
})
