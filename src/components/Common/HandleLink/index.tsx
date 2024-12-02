import Link from "next/link";

interface HandleLinkProps {
  link: string;
  label: string;
  isExternalPage: boolean;
  dontTrack?: boolean;
  newTab?: boolean;
  className?: string;
  role?: string;
  itemProp?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const HandleLink: React.FC<HandleLinkProps> = ({
  link,
  label,
  isExternalPage,
  dontTrack = false,
  newTab = false,
  className = "",
  role,
  itemProp,
  onClick,
  children,
}) => {
  const commonProps: Record<string, any> = {
    title: label,
    className,
    onClick,
  };

  if (role) commonProps.role = role;
  if (itemProp) commonProps.itemProp = itemProp;
  if (newTab) commonProps.target = "_blank";
  if (dontTrack) commonProps.rel = "noopener noreferrer";

  if (isExternalPage) {
    return (
      <a data-tag="anchortag" href={link} {...commonProps}>
        {children}
      </a>
    );
  }

  return (
    <Link data-tag="linktag" href={link} {...commonProps}>
      {children}
    </Link>
  );
};

export default HandleLink;
