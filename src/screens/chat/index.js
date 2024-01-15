// Chat.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import io from 'socket.io-client';
import { Avatar, Box, HStack, Spacer, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { APP_ENV } from '@env';

const socket = io(`${APP_ENV}`);

const Chat = ({ route }) => {
    const { userId } = route.params;

    const [data, setData] = useState([]);
    const [inputText, setInputText] = useState('');
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`${APP_ENV}/v1/security/findById2?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data.data);
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchData();
    }, [userId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`${APP_ENV}/v1/getUserChat?receiverId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response.data.data);
            } catch (error) {
                console.error('Error fetching chat data:', error.message);
            }
        };

        fetchData();
    }, [userId]);

    useEffect(() => {
        socket.on('newMessage', (newMessage) => {
            setData((prevData) => [...prevData, newMessage]);
        });

        return () => {
            socket.off('newMessage');
        };
    }, []);

    const handleSend = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            socket.emit('message', {
                receiverId: userId,
                message: inputText,
            });

            const response = await axios.post(
                `${APP_ENV}/v1/sendMessage`,
                {
                    receiverId: userId,
                    message: inputText,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setInputText('');
        } catch (error) {
            console.error('Error sending message:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <Box pl={["0", "4"]} pr={["0", "5"]} py="2" >
                    <HStack space={[2, 3]} justifyContent="space-between" alignItems={"center"}>
                        <Avatar size="48px" source={{ uri: user?.image }}>
                            <Avatar.Badge bg={user?.is_online ? "green.500" : "red.500"} />
                        </Avatar>
                        <VStack>
                            <Text _dark={{ color: "warmGray.50" }} color="coolGray.800" bold>
                                {user?.username}
                            </Text>
                            <Text color="coolGray.600" _dark={{ color: "warmGray.200" }}>
                                {user?.is_online ? "Online" : "Offline"}
                            </Text>
                        </VStack>
                        <Spacer />
                    </HStack>
                </Box>
            </TouchableOpacity>
            <FlatList
                data={data}
                keyExtractor={(item) => item?.message_id}
                renderItem={({ item }) => {
                    const isSender = item?.sender_id === userId;

                    return (
                        <View
                            style={[
                                styles.messageContainer,
                                isSender ? styles.receiverMessage : styles.senderMessage,

                            ]}
                        >
                            <Text
                                style={[
                                    styles.messageText,
                                    isSender ? styles.receiverMessageText : styles.senderMessageText,

                                ]}
                            >
                                {item?.message}
                            </Text>
                            <Text style={styles.timestampText}>{item?.timestamp}</Text>
                        </View>
                    );
                }}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    value={inputText}
                    onChangeText={(text) => setInputText(text)}
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 16,
    },
    messageContainer: {
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
        maxWidth: '80%',
    },
    senderMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#5F81FF', // Blue for sender
    },
    receiverMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E0E0E0', // Grey for receiver
    },

    messageText: {
        fontSize: 16,
        color: 'black',
    },
    senderMessageText: {
        color: 'white',
    },
    receiverMessageText: {
        color: 'black',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        paddingHorizontal: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    sendButton: {
        backgroundColor: '#5F81FF', // Sesuaikan dengan warna yang diinginkan
        padding: 10,
        borderRadius: 8,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Chat;
