import { useCallback, useState } from 'react';
import { VStack, Heading, SectionList, Text, useToast } from  'native-base';

import { useFocusEffect } from '@react-navigation/native';

import { ScreenHeader } from '@components/ScreenHeader';
import { HistoryCard } from '@components/HistoryCard';
import { Loading } from '@components/Loading';

import { AppError } from '@utils/AppError';

import { api } from '@services/api';

import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO';

export function History(){
    
    const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);
    const [ isLoading, setIsLoading ] = useState(true);

    const toast = useToast();

    async function fetchHistory() {
        try {
            setIsLoading(true)

            const response = await api.get("/history");

            setExercises(response.data);
            
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não foi possivel carregar o historico."

            toast.show({
                title: title,
                placement: "top",
                bgColor: "red.500"
            });
        }
        finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(useCallback(() => {
        fetchHistory();
    }, []));
    
    return (
        <VStack flex={1}>
            <ScreenHeader title="Histórico de Exercicios"/>
            
            { isLoading ? <Loading/> :
                <SectionList 
                 sections={exercises}
                 keyExtractor={item => item.id}
                 renderItem={({item}) => (
                        <HistoryCard data={item}/>
                    )
                 }
                 renderSectionHeader={({ section }) => (
                        <Heading color="gray.200"fontSize="md" mt={10} mb={3} fontFamily="heading">
                            { section.title }
                        </Heading>
                    )
                }
                 px={8}
                 contentContainerStyle={exercises.length === 0 && {
                    flex: 1, justifyContent: "center"
                 }}
                 ListEmptyComponent={
                    <Text color="gray.100" textAlign="center">
                        Não há exercicios registrados ainda. {'\n'}
                        Vamos fazer exercicios hoje?
                    </Text>
                 }
                 showsVerticalScrollIndicator={false}
                />
            }
        </VStack>
    );
}