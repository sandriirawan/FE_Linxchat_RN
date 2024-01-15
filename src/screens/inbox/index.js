import React, { useEffect, useState } from "react";
import { Box, FlatList, Heading, Avatar, HStack, VStack, Text, Spacer, Center, NativeBaseProvider } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const InboxChat = () => {
    const navigation = useNavigation();
    const goToChat = (userId) => {
        navigation.navigate("Chat", { userId });
    };

    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const response = await axios.get(`http://192.168.0.108:5000/v1/getAllUserChat`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };
        fetchData();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => goToChat(item.sender_id)}>
            <Box borderBottomWidth="1" _dark={{ borderColor: "muted.50" }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
                <HStack space={[2, 3]} justifyContent="space-between">
                    <Avatar size="48px" source={{ uri: item.sender_image }}>
                    <Avatar.Badge bg={item.is_online ? "green.500" : "red.500"} />
                    </Avatar>
                    <VStack>
                        <Text _dark={{ color: "warmGray.50" }} color="coolGray.800" bold>
                            {item.sender_username}
                        </Text>
                        <Text color="coolGray.600" _dark={{ color: "warmGray.200" }}>
                            {item.message}
                        </Text>
                    </VStack>
                    <Spacer />
                    <Text fontSize="xs" _dark={{ color: "warmGray.50" }} color="coolGray.800" alignSelf="flex-start">
                        {item.timestamp}
                    </Text>
                </HStack>
            </Box>
        </TouchableOpacity>
    );


    return (
        <FlatList
            data={data}
            w={370}
            ListHeaderComponent={() => (
                <Heading fontSize="xl" p="4" pb="3">
                    Inbox
                </Heading>
            )}
            renderItem={renderItem}

            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
        />
    );
};

const App = () => {
    return (
        <NativeBaseProvider>
            <Center flex={1}>
                <InboxChat />
            </Center>
        </NativeBaseProvider>
    );
};

export default App;
