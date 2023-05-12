import { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { VStack, Center ,Image, Text, Heading, ScrollView, useToast } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';

import { api } from "@services/api";

import { useAuth } from '@hooks/useAuth';

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg';

import { AppError } from '@utils/AppError';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

type FormDataProps ={
    name: string,
    email: string,
    password: string,
    password_confirm: string
}

const SignUpSchema = yup.object({
    name: yup.string().required("Informe o nome."),
    email: yup.string().required("Informe o e-mail.")
                       .email("Email Invalido."),
    password: yup.string().required("Informe a senha.")
                 .min(6, "A senha deve conter pelo menos 6 digitos."),
    password_confirm: yup.string().required("Confirme a senha.")
        .oneOf([yup.ref("password")], "A confirmação da senha não confere.")
});

export function SignUp(){

    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(SignUpSchema)
    });

    const toast = useToast();
    const { signIn } = useAuth();

    const navigation = useNavigation();

    async function handleSignUp({ name, email, password }: FormDataProps){
        // await fetch("http://192.168.100.76:3333/users", {
        //     method: "POST",
        //     headers: {
        //         "Accept": "application/json",
        //         "Content-type": "application/json",
        //     },
        //     body: JSON.stringify({ name, email, password })
        // })
        // .then(response => response.json())
        // .then(data => console.log(data));

        try {
            setIsLoading(true);
            await api.post("/users", { name, email, password });
            signIn(email, password);
        } 
        catch(error) {
            setIsLoading(false);

            const isAppError = error instanceof AppError;
            const tilte = isAppError ? error.message : "Não foi possivel criar a conta, tente novamente mais tarde";

            toast.show({
                title: tilte,
                placement: "top",
                bgColor: "red.500"
            });
        }
    }

    function handleGoBack(){
        navigation.goBack();
    }

    return (
        <ScrollView 
         contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}
        > 
        {/* flexGrow => por padrao ocupar toda a tela (Em cima)*/}
            <VStack flex={1} px={10} pb={16}>
                <Image
                    source={BackgroundImg}
                    defaultSource={BackgroundImg}
                    alt="Pessoas treinando"
                    resizeMode='contain'
                    position='absolute'
                />

                <Center my={24}> {/* margem no eixo y ou na vertical*/}
                    <LogoSvg/>
                    <Text color='gray.100' fontSize='sm'>
                        Treine sua mente e o seu corpo
                    </Text>
                </Center>

                <Center>
                    <Heading color="gray.100" fontSize="xl" 
                    mb={6} fontFamily="heading">
                        Crie sua conta
                    </Heading>

                    <Controller
                     control={control}
                     name="name"
                     render={({field: { onChange, value }}) => (
                        <Input 
                         placeholder="Nome"
                         onChangeText={ onChange }
                         value={value}
                         errorMessage={errors.name?.message}
                        />
                     )}
                    />

                    <Controller
                     control={control}
                     name="email"
                     render={({field: { onChange, value }}) => (
                        <Input 
                         placeholder="E-mail"
                         keyboardType="email-address"
                         autoCapitalize="none"
                         onChangeText={ onChange }
                         value={value}
                         errorMessage={errors.email?.message}
                        />
                     )}
                    />

                    <Controller
                     control={control}
                     name="password"
                     render={({field: { onChange, value }}) => (
                        <Input 
                         placeholder="Senha"
                         secureTextEntry
                         onChangeText={ onChange }
                         value={value}
                         errorMessage={errors.password?.message}
                       />
                     )}
                    />
                    
                    <Controller
                     control={control}
                     name="password_confirm"
                     render={({field: { onChange, value }}) => (
                        <Input 
                         placeholder="Confirme a Senha"
                         secureTextEntry
                         onChangeText={ onChange }
                         value={value}
                         onSubmitEditing={handleSubmit(handleSignUp)}
                         returnKeyType='send'
                         errorMessage={errors.password_confirm?.message}
                        />
                     )}
                    />

                    <Button 
                     title="Criar e acessar"
                     onPress={handleSubmit(handleSignUp)}
                     isLoading={isLoading}
                    />
                </Center>
                
                
                <Button 
                 title="Voltar para o login" 
                 variant="outline" 
                 mt={12}
                 onPress={handleGoBack}
                />
                
            </VStack>
        </ScrollView>
    );
}