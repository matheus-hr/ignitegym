import { useNavigation } from '@react-navigation/native'
import { VStack, Center ,Image, Text, Heading, ScrollView } from 'native-base';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

export function SingIn(){

    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    function handleNewAcount(){
        navigation.navigate('SingUp');
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

                    <Input 
                    placeholder="E-mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    />

                    <Input 
                    placeholder="Senha"
                    secureTextEntry
                    />

                    <Button title="Acessar"/>
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