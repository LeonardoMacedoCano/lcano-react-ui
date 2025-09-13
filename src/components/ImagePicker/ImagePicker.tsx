import React, { useRef } from 'react';
import styled, { keyframes } from 'styled-components';

export interface ImagePickerProps {
  icon: React.ReactNode;
  imageUrl?: string;
  onChange?: (file: File) => void;
  size?: string;
  borderColor?: string;
  isLoading?: boolean;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  imageUrl,
  onChange,
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
    if (file && onChange) {
      onChange(file);
    }
  };

  return (
    <Container size={size}>
      <Avatar
        src={imageUrl || '/default-profile-image.png'}
        alt="Profile"
        borderColor={borderColor}
        isLoading={isLoading}
      />
      {isLoading && <Spinner />}
      <CameraButton
        onClick={handleImageClick}
        borderColor={borderColor}
        disabled={isLoading}
        aria-label="Upload image"
      >
        {icon}
      </CameraButton>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </Container>
  );
};

export default ImagePicker;

interface ContainerProps {
  size: string;
}

const Container = styled.div<ContainerProps>`
  position: relative;
  width: ${props => props.size};
  height: ${props => props.size};
  margin: 0 auto;
`;

interface AvatarProps {
  borderColor?: string;
  isLoading?: boolean;
}

const Avatar = styled.img<AvatarProps>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${props => props.borderColor || props.theme.colors.quaternary};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.isLoading ? 0.7 : 1};
`;

const spin = keyframes`
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
`;

const Spinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

interface CameraButtonProps {
  borderColor?: string;
  disabled?: boolean;
}

const CameraButton = styled.button<CameraButtonProps>`
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
  transition: transform 0.2s ease, opacity 0.2s ease;
  opacity: ${props => props.disabled ? 0.7 : 1};
  border: none;
  outline: none;

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'scale(1.1)'};
  }
`;
