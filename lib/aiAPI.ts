import Replicate from "replicate";
import { getLatestPostFromUser } from "./appwrite";


async function imageUrlToBase64(url: any) {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export const checkImageByUrl = async (url: any) => {
    const prompt = process.env.EXPO_PUBLIC_REPLICATE_PROMPT;
    const model: any = `${process.env.EXPO_PUBLIC_REPLICATE_MODEL_NAME}/${process.env.EXPO_PUBLIC_REPLICATE_MODEL_ENDPOINT}`;
    const replicate = new Replicate({
        auth: process.env.EXPO_PUBLIC_REPLICATE_API_TOKEN,
    });

    const isThisADog = async (imageUrl: any) => {
        try {
            const output: any = await replicate.run(
                model,
                {
                    input: {
                        image: imageUrl,
                        top_p: 1,
                        prompt: prompt,
                        max_tokens: 1024,
                        temperature: 0.2
                    }
                }
            );

            return output[0]?.toLowerCase() === "true";

        } catch (error: any) {
            console.error("Error with API: ", error);
            return false;
        }
    };

    const isDog: boolean = await isThisADog(url);
    return isDog;
}

export const getPredictionById = async (predictionId: string) => {
    try {
        const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${process.env.EXPO_PUBLIC_REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch prediction: ${response.statusText}`);
        }

        const data = await response.json();

        return data;
    } catch (error: any) {
        throw new Error('Failed to fetch prediction');
    }
};

export const cartoonize = async (imageUrl: any) => {
    const replicate = new Replicate({
        auth: `${process.env.EXPO_PUBLIC_REPLICATE_API_TOKEN}`
    });

    try {
        const output: any = await replicate.predictions.create({
            model: `${process.env.EXPO_PUBLIC_REPLICATE_CARTOON_MODEL_NAME}`,
            version: `${process.env.EXPO_PUBLIC_REPLICATE_CARTOON_MODEL_VERSION}`,
            input: {
                // seed: 2862431,
                seed: 2144727,
                image: imageUrl
            }
        })

        return output.id

    } catch (error: any) {
        console.log('Error', error);
        throw new Error(error);
    }
};
