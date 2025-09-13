import React, { useRef } from 'react';
import styled from 'styled-components';

export interface ImagePickerProps {
  icon: React.ReactNode;
  currentImage?: string;
  onImageChange?: (file: File) => void;
  size?: string;
  borderColor?: string;
  isLoading?: boolean;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  currentImage,
  onImageChange,
  size = '150px',
  borderColor,
  isLoading = false,
  icon,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (!isLoading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageChange) {
      onImageChange(file);
    }
  };

  return (
    <ImageContainer size={size}>
      <ProfileImage
        src={currentImage || '/default-profile-image.png'}
        alt="Profile"
        borderColor={borderColor}
        isLoading={isLoading}
      />
      {isLoading && <LoadingOverlay />}
      <UploadButton
        onClick={handleImageClick}
        borderColor={borderColor}
        disabled={isLoading}
      >
        {icon}
      </UploadButton>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </ImageContainer>
  );
};

export default ImagePicker;

interface ImageContainerProps {
  size: string;
}

const ImageContainer = styled.div<ImageContainerProps>`
  position: relative;
  width: ${props => props.size};
  height: ${props => props.size};
  margin: 0 auto;
`;

interface ProfileImageProps {
  borderColor?: string;
  isLoading?: boolean;
}

const ProfileImage = styled.img<ProfileImageProps>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${props => props.borderColor || props.theme.colors.quaternary};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.isLoading ? 0.7 : 1};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

interface UploadButtonProps {
  borderColor?: string;
  disabled?: boolean;
}

const UploadButton = styled.div<UploadButtonProps>`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: ${props => props.borderColor || props.theme.colors.quaternary};
  color: ${props => props.theme.colors.primary};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'scale(1.1)'};
  }
`;
