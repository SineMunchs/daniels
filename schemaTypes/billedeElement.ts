import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'billedeElement',
  title: 'Billede',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt-tekst',
      description: 'Beskriv billedet kort. Vigtigt for SEO og skærmlæsere.',
      type: 'string',
    }),
    defineField({
      name: 'banner',
      title: 'Vis som banner (fuld bredde)',
      description: 'Billedet fylder hele rækken i stedet for kun den ene side.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
