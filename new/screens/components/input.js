import { StyleSheet, TextInput } from "react-native";
import { useState } from "react";


const Input = ({ text, handleText, ifpass }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const styleWithFocus = [styles.input, { borderColor: isFocused ? 'white' : '#656562' }];

    //if the input is not for password entry
    if (ifpass != true)
        return (<TextInput
            style={styleWithFocus}
            onChangeText={handleText}
            value={text}
            autoCorrect={false}
            onFocus={handleFocus}
            onBlur={handleBlur}
        />);
    else
        return (<TextInput
            style={styleWithFocus}
            onChangeText={handleText}
            value={text}
            autoCorrect={false}
            secureTextEntry={true}
            onFocus={handleFocus}
            onBlur={handleBlur}
        />);
};

const styles = StyleSheet.create({
    input: {
        borderStyle: 'solid',
        borderWidth: 2,
        width: '100%',
        marginTop: '1%',
        paddingVertical: '2.5%',
        paddingHorizontal: '5%',
        borderColor: "#b9b9b9",
        color: 'white',
        borderRadius: 10
    },

})

export default Input;