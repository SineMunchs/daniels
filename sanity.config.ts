import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const singletons = [
  {id: 'frontpage', title: 'Forside'},
  {id: 'kontakt', title: 'Footer'},
]

export default defineConfig({
  name: 'default',
  title: 'Artisan',

  projectId: 'okzunbcu',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Indhold')
          .items(
            singletons.map((singleton) =>
              S.listItem()
                .title(singleton.title)
                .id(singleton.id)
                .child(S.document().schemaType(singleton.id).documentId(singleton.id)),
            ),
          ),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Singletons are edited in place — keep them out of the generic "new document" menu.
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global'
        ? prev.filter(
            (template) => !singletons.some((singleton) => singleton.id === template.templateId),
          )
        : prev,
  },
})
