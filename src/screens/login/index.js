import { Input, Icon, Stack, Pressable, Center, NativeBaseProvider, Image, Text, Button } from "native-base";
import React, { useEffect, useState } from 'react'
import { StyleSheet } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import logo from '../../assets/logo.png'
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [show, setShow] = useState(false);
    const navigation = useNavigation();


    const handleLogin = async () => {
        const data = {
            username: username,
            password: password,
        };
        axios.post(
            `http://192.168.0.108:5000/v1/security/login`,
            data
        ).then((response) => {
            console.log(response.data);
            if (response.data.success === true) {
                const token = response.data.token;
                const loggedId = response.data.userId;
                AsyncStorage.setItem("loggedId", loggedId)
                AsyncStorage.setItem("token", token)
                navigation.navigate("Home");
            } else {
                setErrorMessage(response.data.message);
            }
        }).catch((error) => {
            console.error("Login error:", error.message || error.response.data);
        });
    };

    useEffect(() => {
        const token = async () => {
            await AsyncStorage.getItem('token')
        }
        token()
        if (token) {
            navigation.navigate("Home");
        }
    }, [navigation])



    return (
        <Stack space={4} w="100%" alignItems="center" style={styles.container}>
            <Image source={logo} w={100} h={100} mb={75} />
            <Input w={{
                base: "75%",
                md: "25%"
            }}
                InputLeftElement={<Icon as={<MaterialIcons name="person" />} size={5} ml="2" color="muted.400" />}
                placeholder="Name"
                value={username}
                onChangeText={(text) => setUsername(text)}
            />
            <Input w={{
                base: "75%",
                md: "25%"
            }}
                type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
                    <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />}
                        size={5} mr="2" color="muted.400" />
                </Pressable>}
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            {errorMessage ? (
                <Text color="red.500" mt={2}>
                    {errorMessage}
                </Text>
            ) : null}
            <Button success onPress={handleLogin} w={250} mt={5} textAlign={"center"}>
                <Text color={"white"}>Login</Text>
            </Button>

        </Stack>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        marginTop: 100
    },

})