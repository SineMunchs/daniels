import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'kontaktformular',
  title: 'Kontaktformular',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Overskrift',
      initialValue: 'Få et uforpligtende tilbud',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'navTitle',
      title: 'Navigationstitel',
      description:
        'Vises i navigationsmenuen i stedet for overskriften ovenfor. Lad stå tom for at bruge overskriften.',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Bruges som anker-link, f.eks. #tilbud. Genereres ud fra overskriften.',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'position',
      title: 'Placering',
      description: 'Skal formularen vises i venstre eller højre side?',
      type: 'string',
      options: {
        list: [
          {title: 'Venstre', value: 'left'},
          {title: 'Højre', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'right',
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
    select: {title: 'title', subtitle: 'recipientEmail'},
    prepare: ({title, subtitle}) => ({
      title: title || 'Kontaktformular',
      subtitle: subtitle ? `Kontaktformular · ${subtitle}` : 'Kontaktformular',
    }),
  },
})
