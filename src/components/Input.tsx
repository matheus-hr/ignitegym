import { Input as NativeBaseInput, IInputProps, FormControl } from  'native-base';

type Props = IInputProps & {
    errorMessage?: string | null;
}

export function Input({errorMessage = null, isInvalid, ...rest}: Props) {

    const invalid = !!errorMessage || isInvalid;

    return (
        <FormControl isInvalid={invalid} mb={4} /* margin abaixo, ou bottom */>
            <NativeBaseInput
             bg="gray.700"
             h={14} /* Valor de altura height */
             px={4} 
             borderWidth={0} /* tira a borda do input */
             fontSize="md"
             color="white"
             fontFamily="body"
             placeholderTextColor="gray.300"
             isInvalid={invalid}
             _invalid={{
                borderWidth: 1,
                borderColor: "red.500"
             }}
             _focus={{
                bg: "gray.700",
                borderWidth: 1,
                borderColor: "green.500"
             }}
             {...rest} /* precisa sempre ser o ultimo */
            />
            
            <FormControl.ErrorMessage _text={ {color: "red.500"} }>
                {errorMessage}
            </FormControl.ErrorMessage>

        </FormControl>
    );
}