import { useNavigation } from '@react-navigation/native';
import { VStack, Center ,Image, Text, Heading, ScrollView } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

type FormDataProps ={
    name: string,
    email: string,
    password: string,
    password_confirm: string
}

const singUpSchema = yup.object({
    name: yup.string().required("Informe o nome."),
    email: yup.string().required("Informe o e-mail.")
                       .email("Email Invalido."),
    password: yup.string().required("Informe a senha.")
                 .min(6, "A senha deve conter pelo menos 6 digitos."),
    password_confirm: yup.string().required("Confirme a senha.")
        .oneOf([yup.ref("password")], "A confirmação da senha não confere.")
});

export function SingUp(){

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(singUpSchema)
    });

    const navigation = useNavigation();

    function handleSingUp({name, email, password, password_confirm}: FormDataProps){
        console.log({name, email, password, password_confirm});
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
                         onSubmitEditing={handleSubmit(handleSingUp)}
                         returnKeyType='send'
                         errorMessage={errors.password_confirm?.message}
                        />
                     )}
                    />

                    <Button 
                     title="Criar e acessar"
                     onPress={handleSubmit(handleSingUp)}
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