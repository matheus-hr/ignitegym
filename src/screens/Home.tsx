import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { VStack, HStack, FlatList, Heading, Text } from  "native-base";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciceCard } from "@components/ExerciceCard";

export function Home(){

    const [groups, setGroups] = useState(["Costas", "Bícepes", "Trícepes", "Ombro",]);
    const [groupSelected, setGroupSelected] = useState('costas');
    const [exercices, setExercices] = useState(["Puxada frontal", "Remada curvada", "Remada unilateral", "Levantamento terra",]);

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleOpenExerciceDetails(){
        navigation.navigate("exercise");
    }

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
                 keyExtractor={item => item}
                 renderItem={({item}) => (
                    <ExerciceCard
                     onPress={handleOpenExerciceDetails}
                    />
                 )}
                 showsVerticalScrollIndicator={false}
                 _contentContainerStyle={{ paddingBottom: 20 }}
                />
                
            </VStack>

        </VStack>
    );
}