import { getSeoNameFromUrl, getSlikeUrlFromAPI } from "@/utils";

const generateURLETLearnCate = (
  slug: string,
  videoTitleSlug: string,
  msid: string,
) => {
  return `https://economictimes.indiatimes.com/markets/etlearn/${slug}/${videoTitleSlug}/${msid}`;
};

const scheamDateConvert = (timestamp: number) => {
  if (isNaN(timestamp) || typeof timestamp !== "number") {
    return "";
  }
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return "";
  }
  const formattedDate = date.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:MM:SS"
  return `${formattedDate}+05:30`;
};

const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `T${formattedMinutes}M${formattedSeconds}S`;
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
    })),
  };

  return itemListSchemaData;
};

export const VideoObjectSchema = ({ data }: any) => {
  if (!data) return null;

  const {
    thumbnailUrl,
    uploadDate,
    datePublished,
    dateModified,
    name,
    description,
    keywords,
    inLanguage,
    duration,
    contenturl,
  } = data;

  const _uploadDate = scheamDateConvert(parseFloat(uploadDate));
  const _datePublished = scheamDateConvert(parseFloat(datePublished));
  const _dateModified = scheamDateConvert(parseFloat(dateModified));
  const _duration = formatDuration(duration);
  const publisherData = data.publisher;
  const _schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    thumbnailUrl,
    uploadDate: _uploadDate,
    datePublished: _datePublished,
    dateModified: _dateModified,
    name,
    description,
    keywords,
    inLanguage,
    contenturl,
    duration: _duration,
    publisher: {
      "@type": "Organization",
      name: publisherData.name,
      logo: {
        "@type": "ImageObject",
        url: publisherData.logo.url,
        width: publisherData.logo.width,
        height: publisherData.logo.height,
      },
    },
    potentialAction: {
      "@type": "SeekToAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: data?.potentialAction?.urlTemplate,
      },
      "startOffset-input": {
        "@type": "PropertyValueSpecification",
        valueRequired: data.potentialAction.valueRequired,
        valueName: data.potentialAction.valueName,
      },
    },
    image: {
      "@type": "ImageObject",
      url: data.image.url,
      width: data.image.width,
      height: data.image.height,
    },
  };
  return _schema;
};
