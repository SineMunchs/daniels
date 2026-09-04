import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'kontaktSektion',
  title: 'Kontakt',
  type: 'object',
  fields: [
    defineField({
      name: 'note',
      title: 'Bemærkning',
      description:
        'Indholdet (navn, CVR, e-mail, LinkedIn) hentes automatisk fra Footer-dokumentet. Dette element styrer kun, hvor på siden kontaktoplysningerne vises.',
      type: 'string',
      readOnly: true,
      initialValue: 'Indhold hentes fra Footer-dokumentet',
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Kontakt',
      subtitle: 'Navn, CVR, e-mail og LinkedIn fra Footer',
    }),
  },
})
