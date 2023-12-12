import { Alert, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app, auth } from '../firebase';
import { useNavigation } from '@react-navigation/core'
import { signUp, signIn } from '../services/authService';


const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigation();

    const handleSignUp = async () => {
        try {
            const user = await signUp(email, password);
            Alert.alert(`Sign up successful for user ${user.email}`);
        } catch (error) {
            Alert.alert(`Sign up failed: ${error.message}`);
        }
    };

    const handleSignIn = async () => {
        try {
            const user = await signIn(email, password);
            navigate.navigate('Home');
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <View>
                <Text style={styles.header}>Enter your email and password</Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="email"
                    onChangeText={text => setEmail(text)}
                    style={styles.input} />
                <TextInput
                    placeholder="password"
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                    style={styles.input} />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleSignIn}
                    style={styles.button}>
                    <Text>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSignUp}
                    style={styles.buttonAlt} >
                    <Text>Register</Text>
                </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 18,
        paddingBottom: 20,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 7,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginTop: 3,
        borderColor: 'gray',
        borderWidth: 1
    },

    inputContainer: {
        width: 200,
    },
    button: {
        backgroundColor: 'skyblue',
        width: 200,
        paddingHorizontal: 10,
        borderRadius: 7,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,

    },
    buttonAlt: {
        backgroundColor: 'lightgray',
        width: 100,
        paddingHorizontal: 10,
        borderRadius: 7,
        padding: 10,
        alignItems: 'center',
        marginLeft: 10,
        borderWidth: 1,
    },
    buttonContainer: {
        width: 160,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row'

    },
})