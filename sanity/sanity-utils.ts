import { createClient, groq } from "next-sanity";

export async function getProjects() {
  const client = createClient({
    projectId: "icy31qyu",
    dataset: "learning",
    apiVersion: "2025-01-04",
  });

  return client.fetch(
    groq`*[_type == "project"]{
        _id,
        _createdAt,
        name,
        "slug": slug.current,
        "image": image.asset->url,
        url,
        content
    }`
  )
}