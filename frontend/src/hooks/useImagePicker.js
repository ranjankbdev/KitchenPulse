import { useRef, useEffect, useCallback } from 'react';
import showToast from '../utils/toastHelper.js';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/avif', 'image/webp'];
const MAX_SIZE = 1 * 1024 * 1024; // 1MB

const useImagePicker = (setPicture, setPreview) => {
  const previousBlobRef = useRef(null);

  // revoke helper (avoid duplicate code)
  const revokePreviousBlob = useCallback(() => {
    if (!previousBlobRef.current) return;

    URL.revokeObjectURL(previousBlobRef.current);
    previousBlobRef.current = null;
  }, []);

  // validate file
  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast('Only JPG, PNG, WEBP or AVIF images are allowed!', 'error');
      return false;
    }

    if (file.size > MAX_SIZE) {
      showToast('File size must be less than 1MB!', 'error');
      return false;
    }

    return true;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => revokePreviousBlob();
  }, [revokePreviousBlob]);

  const handleImageSelection = useCallback(
    (file) => {
      if (!file || !validateFile(file)) return;

      revokePreviousBlob();

      const blobUrl = URL.createObjectURL(file);
      previousBlobRef.current = blobUrl;

      setPicture(file);
      setPreview(blobUrl);
    },
    [setPicture, setPreview, revokePreviousBlob]
  );

  const clearImage = useCallback(() => {
    revokePreviousBlob();
    setPicture(null);
    setPreview('');
  }, [setPicture, setPreview, revokePreviousBlob]);

  return { handleImageSelection, clearImage };
};

export default useImagePicker;
