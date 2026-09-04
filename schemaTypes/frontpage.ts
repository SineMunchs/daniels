import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'frontpage',
  title: 'Forside',
  type: 'document',
  fields: [
    defineField({
      name: 'sections',
      title: 'Sektioner',
      description:
        'Tilføj, omdøb og omarranger (træk i håndtaget) sektionerne på forsiden. Rækkefølgen her styrer både siden og navigationen.',
      type: 'array',
      of: [{type: 'section'}, {type: 'kontaktformular'}, {type: 'kontaktSektion'}],
    }),
  ],
  preview: {
    select: {sections: 'sections'},
    prepare: ({sections}) => ({
      title: 'Forside',
      subtitle:
        sections && sections.length > 0
          ? sections
              .map((section: {title?: string; navn?: string}) => section.title || section.navn)
              .join(', ')
          : 'Ingen sektioner endnu',
    }),
  },
})
