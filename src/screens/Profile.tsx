import { useState } from 'react';

import { TouchableOpacity } from 'react-native';

import { VStack, ScrollView, Center, Skeleton, Text, Heading, useToast } from  'native-base';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'; 

import * as yup from "yup";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

import defaultUserPhotoImg from "@assets/userPhotoDefault.png"

import { useAuth } from '@hooks/useAuth';

import { api } from '@services/api';

import { AppError } from '@utils/AppError';

const PHOTO_SIZE = 33;

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    old_password: string;
    confirm_password: string;
}

export function Profile(){

    const profileSchema = yup.object<FormDataProps>({
        name: yup.string().required("Informe o nome."),
        email: yup.string(),
        old_password: yup.string(),
        password: yup.string()
                     .min(6, "A senha deve ter pelo menos 6 digitos")
                     .nullable()
                     .transform((value) => !!value ? value : null),
        confirm_password: yup.string()
                             .nullable()
                             .transform((value) => !!value ? value : null)
                             .oneOf([yup.ref('password'), null], "A confirmação da senha não confere.")
                             .when("password", {
                                is: (Field: any) => { Field && Field.length > 0 },
                                then: () => yup.string()
                                                .transform((value) => !!value ? value : null)
                                                .nullable()
                                                .required("Informe a confirmação da senha")
                             })
    });

    const [isUpdating, setUpdating] = useState(false);
    const [photoIsLoading, setPhotoIsLoading] = useState(false)

    const toast = useToast();
    const { user, updateUserProfile } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        defaultValues:{
            name: user.name,
            email: user.email
        },
        resolver: yupResolver(profileSchema)
    });

    async function handleUserPhotoSelect(){
        try
        {
            setPhotoIsLoading(true);

            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
                selectionLimit: 1
            });
    
            if(photoSelected.canceled) {
                return;
            }

            if(photoSelected.assets[0].uri) {

                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);
                
                if(photoInfo.exists && photoInfo.size && (photoInfo.size / 1024 / 1024 ) > 5) {
                    return toast.show({
                        title: "Essa imagem é muito grande, escolha uma de até 5MB",
                        placement: "top",
                        bgColor: "red.500"
                    })
                }

                const fileExtension = photoSelected.assets[0].uri.split(".").pop();
                
                const photoFile = {
                    name: `${user.name}.${fileExtension}`.toLowerCase(),
                    uri: photoSelected.assets[0].uri,
                    type: `${photoSelected.assets[0].type}/${fileExtension}`
                } as any;

                const userPhotoUploadForm = new FormData();
                userPhotoUploadForm.append("avatar", photoFile);

                const avatarUpdatedResponse = await api.patch("/users/avatar", userPhotoUploadForm, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                const userUpdated = user;
                userUpdated.avatar = avatarUpdatedResponse.data.avatar;

                updateUserProfile(userUpdated);


                toast.show({
                    title: "Foto atualizada com sucesso.",
                    placement: "top",
                    bgColor: "green.500"
                })
            }
        }
        catch(error)
        {
            console.log(error)
        }
        finally
        {
            setPhotoIsLoading(false);
        }
    }

    async function handleProfileUpdate(data: FormDataProps){
        try {
            setUpdating(true);

            const userUpdated = user;
            userUpdated.name = data.name;

            await api.put("/users", data);

            await updateUserProfile(userUpdated);

            toast.show({
                title: "Perfil atualizado com sucesso",
                placement: "top",
                bgColor: "green.500"
            })            
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "não foi possivel atualizar dados. Tente novamente mais tarde.";

            console.log(error);

            toast.show({
                title: title,
                placement: "top",
                bgColor: "red.500"
            });  
            
        }
        finally {
            setUpdating(false);
        }
    }

    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil"/>

            <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                <Center mt={6} px={10}>
                    { 
                     photoIsLoading ? 
                    
                        <Skeleton 
                         w={PHOTO_SIZE} 
                         h={PHOTO_SIZE} 
                         rounded="full"
                         startColor="gray.400"
                         endColor="green.500"
                        />
                     :
                        <UserPhoto
                        source={
                            user.avatar ? 
                            { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } : 
                            defaultUserPhotoImg 
                        }
                         alt="Foto do usuario"
                         size={PHOTO_SIZE}
                        />
                    }

                    <TouchableOpacity>
                        <Text 
                         color="green.500" 
                         fontWeight="bold" 
                         fontSize="md" 
                         mt={2} 
                         mb={8}
                         onPress={handleUserPhotoSelect}
                        >
                            Alterar foto
                        </Text>
                    </TouchableOpacity>
                    
                    <Controller
                     control={control}
                     name='name'
                     render={({field: {value, onChange}}) => (
                            <Input
                             bg="gray.600"
                             placeholder='Nome'
                             onChangeText={onChange}
                             value={value}
                             errorMessage={errors.name?.message}
                            />
                        )
                     }
                    />

                    <Controller
                     control={control}
                     name='email'
                     render={({field: {value, onChange}}) => (
                            <Input
                             bg="gray.600"
                             placeholder='E-mail'
                             onChangeText={onChange}
                             value={value}
                             isDisabled
                            />
                        )
                     }
                    />

                    <Heading 
                     color="gray.200" 
                     fontSize="md" 
                     mb={2}
                     alignSelf="flex-start"
                     mt={12}
                     fontFamily="heading"
                    >
                        Alterar Senha
                    </Heading>
                     
                    <Controller
                     control={control}
                     name='old_password'
                     render={({field: {value, onChange}}) => (
                            <Input
                             bg="gray.600"
                             placeholder='Senha antiga'
                             secureTextEntry
                             onChangeText={onChange}
                             value={value}
                            />
                        )
                     }
                    />

                    <Controller
                     control={control}
                     name='password'
                     render={({field: {value, onChange}}) => (
                            <Input
                             bg="gray.600"
                             placeholder='Nova senha'
                             secureTextEntry
                             onChangeText={onChange}
                             value={value}
                             errorMessage={errors.password?.message}
                            />
                        )
                     }
                    />

                    <Controller
                     control={control}
                     name='confirm_password'
                     render={({field: {value, onChange}}) => (
                            <Input
                             bg="gray.600"
                             placeholder='Confirme a nova senha'
                             secureTextEntry
                             onChangeText={onChange}
                             value={value}
                             errorMessage={errors.confirm_password?.message}
                            />
                        )
                     }
                    />

                    <Button 
                     title="Atualizar"
                     mt={4}
                     isLoading={isUpdating}
                     onPress={handleSubmit(handleProfileUpdate)}
                    />
                </Center>
            </ScrollView>
        </VStack>
    );
}