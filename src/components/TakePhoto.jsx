import { Camera, CameraResultType } from '@capacitor/camera';

async function takePicture() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    
    // image.webPath contient l'URL de la photo
    return image.webPath;
  } catch (error) {
    console.error('Error taking picture:', error);
  }
}

export function PhotoButton() {
  const handleTakePhoto = async () => {
    const photoUrl = await takePicture();
    console.log('Photo URL:', photoUrl);
    // Uploader vers Firebase Storage...
  };
  
  return (
    <button onClick={handleTakePhoto}>
      📸 Prendre une photo
    </button>
  );
}