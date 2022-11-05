import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../services/api";
import { PoolCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Share } from "react-native";
import { Guesses } from "../components/Guesses";

interface RouteParams {
  id: string;
}

export function Details() {
  const route = useRoute();
  const { id } = route.params as RouteParams;
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const [poolDetails, setPoolDetails] = useState<PoolCardProps>(
    {} as PoolCardProps
  );
  const [selectedOption, setSelectedOption] = useState<0 | 1>(0);

  async function handleCodeShare() {
    Share.share({
      message: `Entre no meu bolão! [${poolDetails.code}]`,
    });
  }

  async function fetchPoolDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/pools/${id}`);
      console.log(response.data.pools);
      setPoolDetails(response.data.pools);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Opa... Não foi possível listar os detalhes do seu bolão!",
        placement: "top",
        bgColor: "red.500",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poolDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />
      {poolDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />

          <HStack bgColor="gray.800" p={1} mb={5} rounded="sm">
            <Option
              title="Seus palpites"
              isSelected={selectedOption === 0}
              onPress={() => setSelectedOption(0)}
            />
            <Option
              title="Ranking do Grupo"
              isSelected={selectedOption === 1}
              onPress={() => setSelectedOption(1)}
            />
          </HStack>

          <Guesses poolId={poolDetails.id} code={poolDetails.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  );
}
