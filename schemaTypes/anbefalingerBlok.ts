import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'anbefalingerBlok',
  title: 'Anbefalinger',
  type: 'object',
  fields: [
    defineField({
      name: 'anbefalinger',
      title: 'Anbefalinger',
      description:
        'Tilføj en anbefaling ad gangen. Layoutet tilpasser sig automatisk: én vises centreret, to deler pladsen, tre vises centreret som gruppe, og fire eller flere bliver en lodret scrolleliste.',
      type: 'array',
      of: [{type: 'anbefaling'}],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {anbefalinger: 'anbefalinger'},
    prepare: ({anbefalinger}) => ({
      title: 'Anbefalinger',
      subtitle:
        anbefalinger && anbefalinger.length > 0
          ? `${anbefalinger.length} anbefaling${anbefalinger.length === 1 ? '' : 'er'}`
          : 'Ingen anbefalinger endnu',
    }),
  },
})
