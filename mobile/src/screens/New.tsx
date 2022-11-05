import { Heading, Text, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import Logo from "../assets/logo.svg";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";

export function New() {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  async function handlePollCreate() {
    if (!title.trim()) {
      return toast.show({
        title: "Opa... Você precisa informar um nome para o seu bolão!",
        placement: "top",
        bgColor: "red.500",
      });
    }

    try {
      setIsLoading(true);
      await api.post("/pools", { title: title.toUpperCase() });
      toast.show({
        title: `Bolão ${title} criado com sucesso!`,
        placement: "top",
        bgColor: "green.500",
      });
      setTitle("");
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Opa... Não foi possível criar o seu bolão!",
        placement: "top",
        bgColor: "red.500",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" />
      <VStack mt={8} mx={5} alignItems="center">
        <Logo />
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie seu próprio bolão da copa{"\n"}e compartilhe entre amigos!
        </Heading>
        <Input
          mb={2}
          placeholder="Qual nome do seu bolão?"
          onChangeText={setTitle}
          value={title}
        />
        <Button
          title="CRIAR MEU BOLÃO"
          onPress={handlePollCreate}
          isLoading={isLoading}
        />
        <Text color="gray.200" fontSize="sm" px={10} textAlign="center" mt={4}>
          Após criar seu bolão, você receberá um{"\n"}código único que poderá
          usar para convidar{"\n"}outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
}
