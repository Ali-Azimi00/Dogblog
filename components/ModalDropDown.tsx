import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable, Image } from 'react-native';
import { icons } from '../constants'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { router } from 'expo-router'
import { updateFollowing, isFollowing } from '@/lib/appwrite';
import { downloadImage } from '@/lib/downloadImage'

export default function ModalDropdown({
    modalIcon,
    classStyles,
    currentCard,
    cardId,
    modalOptions,
    passFunction,
    postUserId,
    imageUrl,
    cartoon,
}: any) {

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Select an option');


    //push to selected option
    const handleSelect = (option: any) => {
        setSelectedOption(option);
        setModalVisible(false);
    };

    const following = () => {
        return isFollowing(postUserId);
    }

    useEffect(() => {

        if (selectedOption == 'Update') {
            router.push({
                pathname: '/update/updatePost',
                params: {
                    formDataString: JSON.stringify(currentCard),
                    cardId: cardId
                }
            });
        }
        if (selectedOption == 'LogOut') {
            passFunction();
        }

        if (selectedOption == 'Follow') {
            updateFollowing(postUserId, false);
            passFunction('Unfollow')
        }

        if (selectedOption == 'Unfollow') {
            updateFollowing(postUserId, true);
            passFunction('Follow')
        }

        if (selectedOption == 'See Profile') {
            const followState = following();

            router.push({
                pathname: '/following/userProfile',
                params: {
                    postUserId: postUserId,
                    cardId: cardId,
                    followDataString: JSON.stringify(followState),
                }
            });
        }

        if (selectedOption == 'Download Image') {
            downloadImage(imageUrl)
        }
        if (selectedOption == 'Download AI image') {
            downloadImage(cartoon)
        }

        setSelectedOption('Select an option')
    }, [selectedOption])

    return (
        <View >
            <Pressable onPress={() => setModalVisible(true)}>
                <Image source={modalIcon} className={classStyles}
                    resizeMode='contain' />
            </Pressable>


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >

                <Animated.View entering={FadeIn}
                    exiting={FadeOut}
                    style={styles.modalOverlay}

                >
                    <View className='' >
                        <View style={styles.modalContent} className=''>
                            {Array.isArray(modalOptions) && modalOptions.map((option: any, index: any) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.option}
                                    onPress={() => handleSelect(option)}
                                >
                                    <Text style={[styles.optionText, { color: '#ccc' }]}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={[styles.option, styles.cancelOption]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={[styles.optionText, { color: '#FF9C01' }]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Animated.View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({

    buttonText: {
        // color: 'white',
        textAlign: 'center',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',

    },
    modalContent: {
        backgroundColor: '#161622',
        padding: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderWidth: 1,
        borderColor: '#FF9C01',
        borderBottomWidth: 0,
        shadowColor: 'white',
        boxShadow: ' 0 -10px 150px 20px rgba(255, 255, 255, 0.25)'


    },
    option: {
        paddingVertical: 15,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    optionText: {
        fontSize: 18,
        textAlign: 'center',
    },
    cancelOption: {
        marginTop: 10,
    },
});