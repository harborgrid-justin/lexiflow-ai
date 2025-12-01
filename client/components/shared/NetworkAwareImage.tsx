import React from 'react';
import { isSlowConnection } from '@missionfabric-js/enzyme/hooks';

interface NetworkAwareImageProps {
  src: string;
  alt: string;
  className?: string;
  lowQualitySrc?: string;
}

// ✅ ENZYME: Network-aware image loading
export const NetworkAwareImage: React.FC<NetworkAwareImageProps> = ({
  src,
  alt,
  className,
  lowQualitySrc
}) => {
  const isSlow = isSlowConnection();
  
  // Use low quality image on slow connections if available
  const imageSrc = isSlow && lowQualitySrc ? lowQualitySrc : src;
  
  // Add quality parameter to URL if it's a remote image
  const finalSrc = isSlow && !lowQualitySrc && src.startsWith('http') 
    ? `${src}${src.includes('?') ? '&' : '?'}q=low` 
    : imageSrc;

  return (
    <img 
      src={finalSrc} 
      alt={alt} 
      className={className}
      loading="lazy"
    />
  );
};
