import { Input, Icon, Stack, Pressable, Center, NativeBaseProvider, Image, Text, Button, Avatar } from "native-base";
import React, { useEffect, useState } from 'react'
import { StyleSheet } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import logo from '../../assets/logo.png'
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";



const Profile = () => {
    const navigation = useNavigation();
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const response = await axios.get('http://192.168.0.108:5000/v1/security/findById', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response?.data?.data);
            } catch (error) {
                console.error('Error fetching data:', error?.message);
            }
        };

        fetchData();
    }, []);

    const logout = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            console.log(token);

            const response = await axios.put(
                'http://192.168.0.108:5000/v1/security/logout',
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response?.data?.success === true) {
                await AsyncStorage.removeItem("token");
                await AsyncStorage.removeItem("loggedId");
                navigation.navigate("Login");
            }
        } catch (error) {
            console.error("Logout error:", error?.message || error?.response?.data);
        }
    };

    return (
        <Stack space={4} w="100%" alignItems="center" style={styles.container}>
            <Avatar size="100px" source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU"
            }} >
                <Avatar.Badge bg="green.500" />
            </Avatar>
            <Text fontWeight={"bold"}>{data?.username}</Text>

            <Button success onPress={logout} w={250} mt={5} textAlign={"center"} bg={"red.500"} >
                <Text color={"white"}>Logout</Text>
            </Button>
        </Stack>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        marginTop: 100
    },

})