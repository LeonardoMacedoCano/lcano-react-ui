import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Accept, useDropzone } from 'react-dropzone';
import { FaEye, FaTrash, FaUpload } from 'react-icons/fa';
import { getVariantColor } from '../../utils';

export interface DragDropFileProps {
  onFileChange: (file: File | null) => void;
  acceptedFileFormats?: string[];
}

const DragDropFile: React.FC<DragDropFileProps> = ({ onFileChange, acceptedFileFormats }) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      onFileChange(acceptedFiles[0]);
    }
  }, [onFileChange]);

  const accept: Accept | undefined = acceptedFileFormats && acceptedFileFormats.length > 0
    ? acceptedFileFormats.reduce((acc, format) => {
        acc[format] = [];
        return acc;
      }, {} as Accept)
    : undefined;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept,
  });

  const removeFile = () => {
    setFile(null);
    onFileChange(null);
  };

  const viewFile = () => {
    if (file) {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
    }
  };

  return (
    <DropzoneContainer {...getRootProps()} $isDragActive={isDragActive}>
      <input {...getInputProps()} />
      <DropzoneContent>
        <IconWrapper>
          <FaUpload />
        </IconWrapper>
        <p>Clique ou arraste arquivos aqui.</p>
        {acceptedFileFormats && acceptedFileFormats.length > 0 && (
          <p>Formatos aceitos: {acceptedFileFormats.join(', ')}</p>
        )}
      </DropzoneContent>
      {file && (
        <FileInfoContainer>
          <FileName>{file.name}</FileName>
          <ButtonContainer>
            <FileActionButton onClick={(e) => { e.stopPropagation(); viewFile(); }}>
              <FaEye />
            </FileActionButton>
            <FileActionButton onClick={(e) => { e.stopPropagation(); removeFile(); }}>
              <FaTrash />
            </FileActionButton>
          </ButtonContainer>
        </FileInfoContainer>
      )}
    </DropzoneContainer>
  );
};

export default DragDropFile;

const DropzoneContainer = styled.div<{ $isDragActive: boolean }>`
  width: 100%;
  padding: 20px 10px;
  text-align: center;
  cursor: pointer;
  border: 2px dashed ${({ theme, $isDragActive }) =>
    $isDragActive ? getVariantColor(theme, 'info') : theme.colors.tertiary};
  border-radius: 6px;
  background: ${({ theme, $isDragActive }) =>
    $isDragActive ? getVariantColor(theme, 'info'): 'transparent'};
  color: ${({ theme }) => theme.colors.white};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => getVariantColor(theme, 'info')};
    background: ${({ theme }) => getVariantColor(theme, 'tertiary')};
  }
`;

const DropzoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const IconWrapper = styled.div`
  font-size: 32px;
  margin-bottom: 4px;
`;

const FileInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: 4px;
`;

const FileName = styled.span`
  color: ${({ theme }) => getVariantColor(theme, 'info')};
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
`;

const FileActionButton = styled.button`
  padding: 6px 8px;
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: 50%;
  cursor: pointer;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;
