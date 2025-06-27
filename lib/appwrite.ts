import { Functions, Client, Account, ID, Avatars, Databases, Query, Storage, AppwriteException } from 'react-native-appwrite';
import { checkImageByUrl, cartoonize, getPredictionById } from './aiAPI';
import * as FileSystem from 'expo-file-system';
import { ModalPush } from '../app/modal'
import { router } from 'expo-router'
import { CurrentRenderContext } from '@react-navigation/native';

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    videoCollectionId: process.env.EXPO_PUBLIC_APPWRITE_VIDEO_COLLECTION_ID,
    usersCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
    storageId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID,
}

const { endpoint,
    platform,
    projectId,
    databaseId,
    videoCollectionId,
    usersCollectionId,
    storageId }: any = appwriteConfig;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(endpoint || '') // Appwrite Endpoint
    .setProject(projectId || '') // Project ID
    .setPlatform(platform || '') // Application ID or bundle ID.



const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);
const functions = new Functions(client);

export async function createUser(email: string, password: string, username: string) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            databaseId,
            usersCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
                following: [
                    `${process.env.EXPO_PUBLIC_BASE_FOLLOWING1}`,
                    `${process.env.EXPO_PUBLIC_BASE_FOLLOWING2}`,
                    `${process.env.EXPO_PUBLIC_BASE_FOLLOWING3}`,
                    `${newAccount.$id}`],
            }
        )

        return newUser;

    } catch (error: any) {
        throw new Error(error);
    }
}

export const signIn = async (email: string, password: string) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        const currentUser = await getCurrentUser();
        console.log(currentUser)

        return session;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
        return session;
    }
    catch (error: any) {
        throw new Error(error);
    }
}

let cachedCurrentUser: any = null;

export const getCurrentUser = async () => {
    if (cachedCurrentUser) return cachedCurrentUser;

    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            databaseId,
            usersCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        cachedCurrentUser = currentUser.documents[0];
        return cachedCurrentUser;

    } catch (error: any) {
        throw new Error(error);
    }
};

export const getRefreshedUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            databaseId,
            usersCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        cachedCurrentUser = currentUser.documents[0];
        return cachedCurrentUser;

    } catch (error: any) {
        throw new Error(error);
    }
};

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(15)
            ],
        )

        return posts.documents;

    } catch (error: any) {
        throw new Error(error);
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(5)
            ]
        )

        return posts.documents;

    } catch (error: any) {
        throw new Error(error);
    }
}

export const getPostById = async (id: any) => {
    try {

        const post = await databases.getDocument(
            databaseId,
            videoCollectionId,
            id
        )

        return post

    } catch (error: any) {
        throw new Error(error);
    }
}

export const searchPosts = async (query: any) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [
                Query.search('prompt', query),
                Query.orderDesc('$createdAt')
            ]
        )
        return posts.documents;

    } catch (error: any) {
        throw new Error(error);
    }
}

export const getUserPosts = async (userId: any) => {

    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [
                Query.equal("creator", userId),
                Query.orderDesc('$createdAt')
            ]
        )

        return posts.documents;

    } catch (error: any) {
        throw new Error(error);
    }
}

let cachedLatestPost: any = null;

export const getUserById = async (userId: string) => {
    if (userId === cachedCurrentUser.accountId) {
        return cachedCurrentUser
    }
    try {
        const user = await databases.getDocument(
            databaseId,
            usersCollectionId,
            userId
        );

        return user
    }
    catch (error: any) {
        console.log('error', error)
        throw new Error(error);
    }
}

export const getLatestPostFromUser = async (userId: string) => {
    if (cachedLatestPost && cachedLatestPost.userId === userId) return cachedLatestPost;

    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [
                Query.equal("creator", userId),
                Query.orderDesc('$createdAt'),
                Query.limit(1)
            ]
        );

        let thisUser = posts.documents[0]?.creator

        if (posts.documents.length < 1) {
            thisUser = await getUserById(userId)
        }

        const latestPost = {
            url: posts.documents[0]?.thumbnail ?? posts.documents[0]?.image,
            id: posts.documents[0]?.$id || null,
            userId: userId,
            userName: thisUser.username,
            createdAt: posts.documents[0]?.$createdAt
        };

        cachedLatestPost = latestPost;

        return latestPost;

    } catch (error: any) {
        throw new Error(error);
    }
};

export const getBookmarkedPosts = async () => {
    const currentUser = await getCurrentUser();
    const bookmarkedPosts: string[] = currentUser.bookmarked;

    if (bookmarkedPosts.length > 0) {
        try {
            const posts = await databases.listDocuments(
                databaseId,
                videoCollectionId,
                [
                    Query.contains('$id', bookmarkedPosts),
                    Query.orderDesc('$createdAt')
                ]
            );

            return posts.documents;

        } catch (error: any) {
            throw new Error(error);
        }
    }
};

export const updateBookmarkedPost = async (currentPosts: string[]) => {
    const currentUser = await getCurrentUser();

    try {
        const post = await databases.updateDocument(
            databaseId,
            usersCollectionId,
            currentUser.$id,
            {
                bookmarked: currentPosts
            }
        )
    } catch (error: any) {
        throw new Error(error)

    }
}

export const isBookmarked = async (postId: string) => {
    const currentUser = await getCurrentUser();
    const currentPosts: string[] = currentUser.bookmarked;
    return currentPosts.includes(postId);
};

export const clickBookMark = async (postId: any) => {
    const currentUser = await getCurrentUser();
    let currentPosts: string[] = currentUser.bookmarked;
    const postSaved = currentPosts.includes(postId);


    if (!postSaved) {
        currentPosts.push(postId);
    } else {
        const postIndex = currentPosts.indexOf(postId);
        currentPosts.splice(postIndex, 1);
    }
    await updateBookmarkedPost(currentPosts);
};

export const getFilePreview = async (fileId: any, type: any) => {
    let fileUrl;

    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(storageId, fileId)
        }
        else if (type === 'image') {
            fileUrl = storage.getFilePreview(storageId, fileId)
            //width,height,gravity,quality
            //add ImageGravity.Top, 100 ?
        } else {
            throw new Error('Invalid file type. Only image or video are accepted')
        }

        if (!fileUrl) throw Error;
        return fileUrl;

    } catch (error: any) {
        throw new Error(error);
    }
}

interface fileFormat {
    fileName: string,
    mimeType: string,
    fileSize: number,
    uri: string
}

export const uploadFile = async (file: fileFormat, type: string) => {

    if (!file) return;
    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri
    }

    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )

        const fileUrl = await getFilePreview(uploadedFile.$id, type);


        return fileUrl;

    } catch (error: any) {
        console.error('UPOADFILE: ERROR', error)
        throw new Error(error);
    }
}

async function uploadImageFromURL(imageUrl: any) {
    try {
        const fileName = `downloaded_image.png`;
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

        const downloadRes = await FileSystem.downloadAsync(imageUrl, fileUri);

        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
            throw new Error('File not found after download.');
        }

        const file = {
            uri: downloadRes.uri,
            name: fileName,
            type: `image/png`,
            size: fileInfo.size
        };

        const response = await storage.createFile(
            storageId,
            ID.unique(),
            file
        );

        const fileUrl = await getFilePreview(response.$id, "image");


        return fileUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

export const createVideo = async (form: any, setUploading: any) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ]);

        const thumbnailIsDog: boolean = await checkImageByUrl(thumbnailUrl)

        if (thumbnailIsDog) {
            const newPost = await databases.createDocument(
                databaseId, videoCollectionId, ID.unique(), {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId
            })
            setUploading(false)
        } else {
            ModalPush("Try Again", "Thumbnail must be of a dog. \nTry a different Thumbnail");
            setUploading(false)
        }

        return thumbnailIsDog

    } catch (error: any) {
        throw new Error(error)
    }
}

export const createImage = async (form: any, setUploading: any, setPrediction: any) => {
    try {
        const [imageUrl] = await Promise.all([
            uploadFile(form.image, 'image')
        ]);

        const imageIsDog: boolean = await checkImageByUrl(imageUrl)
        if (imageIsDog) {

            let predId = await cartoonize(imageUrl)

            let attempts = 0;
            const maxAttempts = 10;
            const interval = 60000;

            const checkPrediction = async () => {
                try {
                    const prediction = await getPredictionById(predId);

                    if (prediction.output) {
                        form.cartoon = prediction.output;

                        const [cartoonUrl] = await Promise.all([
                            uploadImageFromURL(form.cartoon)
                        ]);
                        const newPost = await databases.createDocument(
                            databaseId, videoCollectionId, ID.unique(), {
                            title: form.title,
                            image: imageUrl,
                            prompt: form.prompt,
                            creator: form.userId,
                            cartoon: cartoonUrl

                        });
                        setUploading(false);
                        setPrediction(true);
                        return newPost;
                    }

                    attempts++;
                    if (attempts < maxAttempts) {
                        console.log(`Attempt ${attempts} failed. Retrying in ${interval / 1000} seconds...`);
                        setTimeout(checkPrediction, interval);

                    } else {
                        // Alert.alert("Something went Wrong", "Try Again")
                        ModalPush("Try Again", "Something went Wrong");
                        console.log('Maximum attempts reached. Cartoon generation failed.');
                        setUploading(false);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    setUploading(false);

                }

            };

            checkPrediction();

        } else {
            // Alert.alert("Not posted", "Image must be of a dog. \nTry a different Image");
            ModalPush("Not posted", "Image must be of a dog. \nTry a different Image");
            setUploading(false);
            return false
        }


    } catch (error: any) {
        console.log(error);
        throw new Error(error)
    }
}


interface mediaForm {
    title: string,
    thumbnail: any,
    video: string,
    image: string,
    prompt: string,
}

export const updateMediaInfo = async (mediaId: any, form: mediaForm) => {

    let imageIsDog: boolean;
    let input: any;

    try {
        if (form.thumbnail) {

            if (typeof form.thumbnail == 'object') {
                const [thumbnailUrl] = await Promise.all([
                    uploadFile(form.thumbnail, 'image')
                ])

                imageIsDog = await checkImageByUrl(thumbnailUrl);
                input =
                {
                    title: form.title,
                    thumbnail: thumbnailUrl,
                    video: form.video,
                    // image: form.image,
                    prompt: form.prompt
                }
            }
            else {
                imageIsDog = true;
                input =
                {
                    title: form.title,
                    thumbnail: form.thumbnail,
                    video: form.video,
                    // image: form.image,
                    prompt: form.prompt
                }

            }

        }
        else {

            imageIsDog = true;

            input =
            {
                title: form.title,
                // thumbnail: thumbnailUrl,
                video: form.video,
                image: form.image,
                prompt: form.prompt
            }

        }

        if (imageIsDog) {
            const post = await databases.updateDocument(
                databaseId,
                videoCollectionId,
                mediaId,
                input
            )
        } else {
            // Alert.alert("Not posted", "Thumbnail must be of a dog. \nTry a different Thumbnail");
            ModalPush("Try Again", "Thumbnail must be of a dog. \nTry a different Thumbnail");
        }

        return imageIsDog;

    } catch (error: any) {
        throw new Error(error);
    }
}

interface profileForm {
    username: string,
    email: string,
    password: string,
    oldPassword: string,
}


export const updateProfile = async (profileInfo: profileForm) => {
    const currentUser = await getCurrentUser();

    try {
        const updatedFields: any = {};

        if (profileInfo.username) {
            updatedFields.username = profileInfo.username;
        }

        if (profileInfo.email) {
            updatedFields.email = profileInfo.email;
        }

        if (profileInfo.password) {

            try {
                const result = await account.updatePassword(
                    profileInfo.password,
                    profileInfo.oldPassword
                );

                if (result) {
                    console.log("password updated")
                }

                router.push({
                    pathname: '/modal',
                    params: {
                        title: 'Success',
                        message: "Profile Updated",
                        nextScreen: '/profile',
                        nextScreenParams: [1]
                    }
                })

            } catch (error: any) {
                console.log('errorlogged updateprofile catch')
                console.log(error.code, error.message)
                throw AppwriteException;
            }

        }

        const updatedUser = await databases.updateDocument(
            databaseId,
            usersCollectionId,
            currentUser.$id,
            updatedFields
        );

        return updatedUser;
    } catch (error: any) {
        throw new Error(error);
    }
};


interface Post {
    title: string,
    thumbnail: any,
    video: string,
    image: string,
    prompt: string,
    cartoon: string,
}

export const deleteMedia = async (mediaId: any) => {

    let post: any = await getPostById(mediaId)

    try {
        await databases.deleteDocument(
            databaseId,
            videoCollectionId,
            mediaId
        )

        const fileImageId: string = await getFileID(post.image);
        const fileCartoonId: string = await getFileID(post.cartoon);

        await deleteFile(fileImageId)
        await deleteFile(fileCartoonId)

    } catch (error: any) {
        throw new Error(error);
    }
}

export const isFollowing = async (postUserId: string) => {
    const currentUser = await getCurrentUser();
    let followingList: string[] = currentUser.following;
    return followingList.includes(postUserId);
};

export const updateFollowing = async (postUserId: string, following: boolean) => {

    const currentUser = await getCurrentUser();
    let followingList: string[] = currentUser.following;

    if (!following) {
        followingList.push(postUserId);
    } else {
        const followingIndex = followingList.indexOf(postUserId);
        followingList.splice(followingIndex, 1);
    }

    try {
        const post = await databases.updateDocument(
            databaseId,
            usersCollectionId,
            currentUser.$id,
            {
                following: followingList
            }
        )

        followingList = [];
    } catch (error: any) {
        throw new Error(error)

    }
}

export const deleteAuthUser = async () => {

    try {
        const currentUser = await getCurrentUser();
        const userId = currentUser.accountId;

        const functionId: any = process.env.EXPO_PUBLIC_APPWRITE_FUNCTION_ID;
        const response = await functions.createExecution(
            functionId,
            JSON.stringify({ userId })
        );

        console.log('Delete Function Response Code', response.responseStatusCode)
        console.log("Delete Function Response Body:", response.errors);

        signOut();
        router.replace("/sign-in");

    } catch (error) {
        console.error("Error deleting user:", error);
    }

};

export const deleteUser = async () => {
    try {
        const currentUser = await getCurrentUser();
        console.log('deleteUser currentUser', currentUser)
        await databases.deleteDocument(
            databaseId,
            usersCollectionId,
            currentUser.$id
        )
    } catch (error: any) {
        throw new Error(error)

    }
}


export const deleteAllPosts = async () => {
    const currentUser = await getCurrentUser();

    try {
        const userPosts = await getUserPosts(currentUser.$id)

        userPosts.forEach((post) => {
            deleteMedia(post.$id)
        })

        ModalPush('All posts Deleted', '')
        router.replace('/profile')

    } catch (error: any) {
        console.log("Error: " + error)
        throw new Error(error);
    }
}

export const deleteFile = async (fileId: string) => {

    try {
        await storage.deleteFile(storageId, fileId);
        console.log('File deleted successfully', fileId);
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

export const getFileID = async (url: string) => {
    const target = "files/";
    const index = url.indexOf(target);
    let fileId: string = "";
    try {
        fileId = url.substring(index + target.length, index + 26)
    }
    catch (error: any) {
        console.log(error)
        throw Error(error)
    }

    return fileId;
}

