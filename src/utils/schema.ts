import { getSeoNameFromUrl } from "@/utils";

const generateURLETLearnCate = (
  slug: string,
  videoTitleSlug: string,
  msid: string,
) => {
  return `https://economictimes.indiatimes.com/markets/etlearn/${slug}/${videoTitleSlug}/${msid}`;
};

export const ListItemSchema = ({
  sectionData,
  slug,
}: {
  sectionData: { title: string; url: string; msid: string }[];
  slug: string[];
}) => {
  const itemListSchemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: sectionData.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: generateURLETLearnCate(
        slug[0],
        getSeoNameFromUrl(item.url, "videoshow"),
        item.msid,
      ),
      name: item.title,
      "@id": generateURLETLearnCate(
        slug[0],
        getSeoNameFromUrl(item.url, "videoshow"),
        item.msid,
      ),
    })),
  };

  return itemListSchemaData;
};
