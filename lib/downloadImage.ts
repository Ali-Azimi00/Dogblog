import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { ModalPush } from '../app/modal'

const getPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return false;
    }
    return true;
};


export const downloadImage = async (imageUrl: string) => {
    const hasPermission = await getPermissions();
    if (!hasPermission) return;

    try {
        const fileUri = FileSystem.documentDirectory + 'downloaded-image.jpg';
        const downloadedFile = await FileSystem.downloadAsync(imageUrl, fileUri);

        const asset = await MediaLibrary.createAssetAsync(downloadedFile.uri);
        await MediaLibrary.createAlbumAsync('Download', asset, false);

        ModalPush("Success", "Image downloaded!");

    } catch (error) {
        console.error(error);

        ModalPush("Error", "Failed to download image.");

    }
};