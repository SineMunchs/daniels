import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'section',
  title: 'Sektion',
  type: 'object',
  fields: [
    defineField({
      name: 'navn',
      title: 'Navn',
      description:
        'Sektionens navn. Bruges som overskrift, og som label i navigationsmenuen hvis "Vis i navigationsmenu" er slået til.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showInNav',
      title: 'Vis i navigationsmenu',
      description: 'Vis denne sektion med navn i navigationsmenuen.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Bruges som anker-link, f.eks. #om. Genereres ud fra navnet.',
      type: 'slug',
      options: {source: 'navn'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'elementer',
      title: 'Indhold',
      description: 'Tilføj indhold ét element ad gangen. De parres to og to og skifter side.',
      type: 'array',
      of: [
        {type: 'tekstElement'},
        {type: 'billedeElement'},
        {type: 'billedeTekstBlok'},
        {type: 'kontaktformularFelt'},
        {type: 'kontaktformularTekstBlok'},
        {type: 'kontaktSektion', title: 'Kontaktoplysninger'},
        {type: 'anbefalingerBlok'},
        {type: 'billedeGalleriBlok'},
      ],
    }),
    defineField({
      name: 'imagePosition',
      title: 'Startside',
      description: 'Hvilken side det første element (og hver anden herefter) starter i.',
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
    select: {title: 'navn', subtitle: 'slug.current'},
    prepare: ({title, subtitle}) => ({
      title: title || 'Unavngivet sektion',
      subtitle: subtitle ? `#${subtitle}` : undefined,
    }),
  },
})
