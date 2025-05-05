const HotPicks = {
  name: "hotPick",
  title: "HotPick",
  type: "document",
  fields: [
    {
      name: "movieName",
      type: "string",
      title: "Movie Name",
    },
    {
      name: "posterUrl",
      title: "PosterUrl",
      type: "url",
    },
    {
      name: "overview",
      title: "Overview",
      type: "text",
    },
    {
      name: "tmbdUrl",
      title: "TMBD_URL",
      type: "url",
    },
    {
      name: "isApproved",
      title: "IsApproved",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "isFromAPI",
      title: "IsfromAPI",
      type: "boolean",
      initialValue: false,
    },
  ],
};

export default HotPicks;
