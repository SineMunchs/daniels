import {defineField} from 'sanity'

export const portableTextBlock = {
  type: 'block',
  styles: [
    {title: 'Normal', value: 'normal'},
    {title: 'Lille', value: 'small'},
    {title: 'Stor', value: 'large'},
    {title: 'Meget stor', value: 'xlarge'},
  ],
  lists: [
    {title: 'Punktliste', value: 'bullet'},
    {title: 'Nummereret liste', value: 'number'},
  ],
  marks: {
    decorators: [
      {title: 'Fed', value: 'strong'},
      {title: 'Kursiv', value: 'em'},
      {title: 'Understreget', value: 'underline'},
      {title: 'Gennemstreget', value: 'strike-through'},
    ],
    annotations: [
      {
        name: 'link',
        title: 'Link',
        type: 'object',
        fields: [
          defineField({
            name: 'href',
            title: 'URL',
            type: 'url',
            validation: (Rule) =>
              Rule.required().uri({scheme: ['http', 'https', 'mailto', 'tel']}),
          }),
          defineField({
            name: 'blank',
            title: 'Åbn i ny fane',
            type: 'boolean',
            initialValue: true,
          }),
        ],
      },
    ],
  },
}
