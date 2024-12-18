import GlobalApi from "@/app/api/_services/GlobalApi";
import NewPage2 from "./_component/NewPage2";

export async function generateMetadata({ params }) {
  const { id } = await params; // slug is an array, e.g., ['categories', '419']
  // const id = slug[slug.length - 1]; // Extract the last element

  console.log("ID:", id);

  try {
    // Fetch the metadata for the news item
    const response = await GlobalApi.fetchOneNews2({
      id: parseInt(id),
    });
    console.log(response.data)
    const { title, description, image_url } = response.data.newsData || {};

    return {
      title: title || "News Details",
      description: description || "Explore the latest news.",
      openGraph: {
        title: title,
        description: description,
        images: [`https://wowfy.in/testusr/images/${image_url}`],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [`https://wowfy.in/testusr/images/${image_url}`],
      },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "News Details",
      description: "Explore the latest news.",
    };
  }
}

export default function NewsSection() {
  return <NewPage2 />;
}
