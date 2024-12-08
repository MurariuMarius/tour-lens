import React, { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';
import { Modal, StyleSheet, Animated, View } from 'react-native';
import { Text } from '@/components/StyledComponents';

const MessageModalContext = createContext();

const useMessageModal = () => {
    const context = useContext(MessageModalContext);
    if (!context) {
        throw new Error('useMessageModal must be used within a MessageModalProvider');
    }
    return context;
};

const MessageModal = ({ children }) => {
    const progress = useRef(new Animated.Value(0)).current;
    const timerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    useEffect(() => {
        console.log("isVisible (updated):", isVisible);
    }, [isVisible]);

    const closeModal = useCallback(() => {
        setIsVisible(false);
        progress.setValue(0);
    }, []);

    const showModal = useCallback((title, message, duration = 5000) => {
        setModalTitle(title);
        setModalMessage(message);
        setIsVisible(true);
        progress.setValue(0);

        Animated.timing(progress, {
            toValue: 1,
            duration,
            useNativeDriver: false,
        }).start();

        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            closeModal();
        }, duration);
    }, [closeModal]);

    return (
        <MessageModalContext.Provider value={{ showModal, closeModal }}>
            <Modal transparent={true} visible={isVisible} animationType="fade" onRequestClose={closeModal}>
                <View style={styles.trainingModalContainer}>
                    <View style={styles.trainingModalContent}>
                        <Text style={styles.trainingModalTitle}>{modalTitle}</Text>
                        <Text style={styles.trainingModalText}>{modalMessage}</Text>
                        <View style={styles.progressBarContainer}>
                            <Animated.View
                                style={[
                                    styles.progressBar,
                                    {
                                        width: progress.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%']
                                        })
                                    }
                                ]}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
            {children}
        </MessageModalContext.Provider>
    );
};

const styles = StyleSheet.create({
    trainingModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingTop: 20,
    },
    trainingModalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxWidth: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    trainingModalTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 22,
    },
    trainingModalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
    },
    progressBarContainer: {
        width: '100%',
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#2196F3',
    },
});


export { MessageModal, useMessageModal };