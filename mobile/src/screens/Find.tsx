import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [code, setCode] = useState("");
  const { navigate } = useNavigation();

  async function handleJoinPool() {
    try {
      setIsLoading(true);
      if (!code.trim()) {
        toast.show({
          title:
            "Aopa... você esqueceu de informar o código ou ele é inválido.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post("/pools/join", { code });

      toast.show({
        title: "Você entrou no bolão com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });

      navigate("pools");
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      if (error.response?.data?.message === "Poll not found.") {
        return toast.show({
          title: "O bolão não foi encontrado",
          placement: "top",
          bgColor: "red.500",
        });
      }

      if (
        error.response?.data?.message === "You already joined in this poll."
      ) {
        return toast.show({
          title: "Você já está participando desse bolão",
          placement: "top",
          bgColor: "red.500",
        });
      }

      toast.show({
        title: "Opa... Não foi possível encontrar o seu bolão!",
        placement: "top",
        bgColor: "red.500",
      });
      throw error;
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />
      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de{"\n"}seu código único
        </Heading>
        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          onChangeText={setCode}
          value={code}
          autoCapitalize="characters"
        />
        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}
