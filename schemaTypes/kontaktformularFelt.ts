import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'kontaktformularFelt',
  title: 'Kontaktformular',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Overskrift',
      initialValue: 'Få et uforpligtende tilbud',
      type: 'string',
    }),
    defineField({
      name: 'recipientEmail',
      title: 'Modtager-mail',
      description: 'Indsendte formularer sendes til denne adresse.',
      type: 'string',
      initialValue: 'tjekforrod@gmail.com',
      validation: (Rule) => Rule.required().email(),
    }),
  ],
  preview: {
    select: {subtitle: 'recipientEmail'},
    prepare: ({subtitle}) => ({
      title: 'Kontaktformular',
      subtitle,
    }),
  },
})
