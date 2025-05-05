const news = {
  name: "news",
  title: "News",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.max(500),
    },
    {
      name: "sourceUrl",
      title: "SourceUrl",
      type: 'url',
      validation: (Rule) => Rule.required(),
    },
    {
      name: "isApproved",
      title: "IsApproved",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "isFromAPI",
      title: "IsFromAPI",
      type: "boolean",
      initialValue: true,
    },
    {
      name: 'publishedAt',
      title: 'PublishedAt',
      type: 'datetime',
    },
  ],
};

export default news;
