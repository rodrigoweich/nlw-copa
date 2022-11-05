import Image from "next/image";
import appPreviewImg from "../assets/app-nlw-preview.png";
import logoImg from "../assets/logo.svg";
import usersAvatarExampleImg from "../assets/avatares.png";
import iconCheckImg from "../assets/icon.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";
import { GetStaticProps } from "next";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}
export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });
      const { code } = response.data;
      await navigator.clipboard.writeText(code);
      alert(
        `O bolão foi criado com sucesso! O código ${code} foi copiado para a área de transferência`
      );
      setPoolTitle("");
    } catch (error) {
      console.log(error);
      alert("Falha ao criar o bolão, por favor, tente novamente!");
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="Logo NWL Copa" quality={80} />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image
            src={usersAvatarExampleImg}
            alt="Imagem com avatares de exemplo"
            quality={80}
          />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount | 0}</span>{" "}
            pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700">
            CRIAR MEU BOLÃO
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" quality={80} />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount | 0}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600" />
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" quality={80} />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">
                +{props.guessCount | 0}
              </span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois dispositivos móveis exibindo a prévia da aplicação NLW Copa"
        quality={100}
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("/pools/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
    revalidate: 60 * 10 * 1, //10 minutes
  };
};
