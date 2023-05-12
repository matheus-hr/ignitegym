import { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { VStack, HStack, FlatList, Heading, Text, useToast } from  "native-base";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";

import { ExerciseDTO } from "@dtos/ExerciseDTO";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciceCard } from "@components/ExerciceCard";
import { Loading } from "@components/Loading";

export function Home(){

    const [groups, setGroups] = useState<string[]>([]);
    const [groupSelected, setGroupSelected] = useState('antebraço');
    const [exercices, setExercices] = useState<ExerciseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const toast = useToast();
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleOpenExerciceDetails(exerciseId: string){
        navigation.navigate("exercise", { exerciseId });
    }

    async function fetchGroups(){
        try {
            const response = await api.get("/groups");
            setGroups(response.data);

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não foi possivel carregar os grupos musculares."

            toast.show({
                title: title,
                placement: "top",
                bgColor: "red.500"
            });
        }
    }

    async function fetchExercicesByGroup() {
        try {
            setIsLoading(true);

            const response = await api.get(`/exercises/bygroup/${groupSelected}`)
            setExercices(response.data);

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não foi possivel carregar os exercicios."

            toast.show({
                title: title,
                placement: "top",
                bgColor: "red.500"
            });
        }    
        finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchGroups();
    }, [])

    useFocusEffect(useCallback(() => {
        fetchExercicesByGroup();
    }, [groupSelected]));

    return (
        <VStack flex={1}>
            <HomeHeader/>
            
            <FlatList
             data={groups}
             keyExtractor={item => item}
             renderItem={({ item }) => (
                <Group 
                 name={item} 
                 isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
                 onPress={() => setGroupSelected(item)}
                />
             )}
             horizontal
             showsHorizontalScrollIndicator={false}
             _contentContainerStyle={{
                px: 8,

            }}
             my={10}
             maxH={10}
             minH={10}
            />

            { isLoading ? <Loading/> : 

            <VStack flex={1} px={8}>
                <HStack justifyContent="space-between" mb={5}>
                    <Heading color="gray.200" fontSize="md" fontFamily="heading">
                        Exercicios
                    </Heading>

                    <Text color="gray.200" fontSize="sm">
                        { exercices.length }
                    </Text>
                </HStack>

                <FlatList
                 data={exercices}
                 keyExtractor={item => item.id}
                 renderItem={({item}) => (
                    <ExerciceCard
                        data={item}
                        onPress={() => handleOpenExerciceDetails(item.id)}
                    />
                 )}
                 showsVerticalScrollIndicator={false}
                 _contentContainerStyle={{ paddingBottom: 20 }}
                />
                
            </VStack>

            }

        </VStack>
    );
}