import { useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import { VStack, Center ,Image, Text, Heading, ScrollView, useToast } from 'native-base';

//  1 - faça as importações necessarias
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import { useAuth } from '@hooks/useAuth';

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';

//  2 - crie a propriedade de formulario
type FormDataProps ={
    email: string,
    password: string,
}

const SignInSchema = yup.object({
    email: yup.string().required("Informe o email").email("Email invalido"),
    password: yup.string().required("Informe a senha")
                 .min(6, "A senha deve conter pelo menos 6 digitos.")
});

export function SignIn(){

    const navigation = useNavigation<AuthNavigatorRoutesProps>();
    const toast = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const { user, signIn } = useAuth();

    {/* 3 - cria uma constante para pegar os principais atributos de useForm */}
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(SignInSchema)
    });

    function handleNewAcount(){
        navigation.navigate('SignUp');
    }

    async function handleSignIn({email, password }: FormDataProps){
        try {   
            setIsLoading(true);
            await signIn(email, password); 
             
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não foi possivel entrar, tente novamnete mais tarde";

            setIsLoading(false);

            toast.show({
                title,
                placement: "top",
                bgColor: "red.500"
            })
        }
    }

    return (
        <ScrollView 
         contentContainerStyle={{flexGrow: 1}}     showsVerticalScrollIndicator={false}
        > 
        {/* flexGrow => por padrao ocupar toda a tela */}
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
                        Acesse sua conta
                    </Heading>

                    {/* 4 - Envolva um componente de imput em um componente controller */}
                    <Controller
                     control={control} 
                     name="email"   //4.1 => É obrigatorio criar
                     render={({field: { onChange, value }}) => ( //4.2 => criar uma arrow function que tenha onCHange para mudar o valor e value para setar um valor inicial
                        <Input 
                         placeholder="E-mail"
                         keyboardType="email-address"
                         autoCapitalize="none"
                         value={value}
                         onChangeText={onChange}
                         errorMessage={errors.email?.message} //4.2 => Onde é passado o erro
                        />
                     )}
                    />

                    <Controller
                     control={control}
                     name="password"
                     render={({field: {onChange, value}}) => (
                        <Input 
                         placeholder="Senha"
                         onChangeText={onChange}
                         value={value}
                         errorMessage={errors.password?.message}
                         secureTextEntry
                        />
                     )}
                    />

                    <Button 
                     title="Acessar"
                     onPress={handleSubmit(handleSignIn)}
                     isLoading={isLoading}
                    />
                </Center>
                
                <Center mt={24}>
                    <Text
                     color="gray.100"
                     fontSize="sm"
                     mb={3}
                     fontFamily="body"
                    >
                        Ainda não tem acesso?
                    </Text>

                    <Button 
                     title="Criar conta" 
                     variant="outline" 
                     onPress={handleNewAcount}
                    />
                </Center>
            </VStack>
        </ScrollView>
    );
}