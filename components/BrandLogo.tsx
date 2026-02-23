import Image from 'next/image';

interface BrandLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function BrandLogo({ className, width = 220, height = 48 }: BrandLogoProps) {
  return (
    <Image
      src="/skillrank-logo.svg"
      alt="SkillRank AI logo"
      width={width}
      height={height}
      priority
      className={className}
    />
  );
}
