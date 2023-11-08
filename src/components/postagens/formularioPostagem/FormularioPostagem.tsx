import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner';

import { atualizar, buscar, cadastrar } from "../../../services/Service";
import { AuthContext } from '../../../contexts/AuthContext';

import Tema from '../../../models/Tema';
import Postagem from '../../../models/Postagem';
import { toastAlerta } from '../../../utils/toastAlerta';

function FormularioPostagem() {

    const navigate = useNavigate();
    //Controla o carregamento da página enquanto uma ação é realizada
    const [isLoading, setIsLoading] = useState<boolean>(false)
    //Variável de estado 'temas' chama um array com todos os temas
    const [temas, setTemas] = useState<Tema[]>([])
    //Variável de estado que traz o objeto (tema nesse caso) escolhido
    const [tema, setTema] = useState<Tema>({ id: 0, descricao: '', })
    //Armazena informações relacionadas a Postagem - que será cadastrado ou atualizado
    const [postagem, setPostagem] = useState<Postagem>({} as Postagem)
    //Pega os parâmetros que são enviados da url
    const { id } = useParams<{ id: string }>()
    //Acessa a authContetx  e desestruturamos seus  dados(usuario) para que essas propriedades possam ser usadas no componente
    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token

    //Função assincrona buscando as postagens pelo Id para edição
    async function buscarPostagemPorId(id: string) {
        await buscar(`/postagens/${id}`, setPostagem, {
            headers: {
                Authorization: token,
            },
        })
    }
    //Função assincrona buscando os temas escolhidos pelo Id
    async function buscarTemaPorId(id: string) {
        await buscar(`/temas/${id}`, setTema, {
            headers: {
                Authorization: token,
            },
        })
    }

    //Buca todos os temas
    async function buscarTemas() {
        await buscar('/temas', setTemas, {
            headers: {
                Authorization: token,
            },
        })
    }

    //Verifica o token e manda pra página de login se estiver vazio
    useEffect(() => {
        if (token === '') {
            toastAlerta('Você precisa estar logado', 'info');
            navigate('/');
        }
    }, [token])

    //buscarTemas é executado quando o o valor de sua variável de dependência (ID) for diferente 
    useEffect(() => {
        buscarTemas()

        if (id !== undefined) {
            buscarPostagemPorId(id)
        }
    }, [id])

    useEffect(() => {
        setPostagem({
            ...postagem,
            tema: tema,
        })
    }, [tema])

    //Captura o input e acessa a propriedade 'name'
    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setPostagem({
            ...postagem,
            [e.target.name]: e.target.value,
            tema: tema,
            usuario: usuario,
        });
    }

    function retornar() {
        navigate('/postagens');
    }
//impede o carregamento da página ao clicar no botão de envio
    async function gerarNovaPostagem(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)


        //se o id for definido e o usuário logado ele vai pra atualização da postagem
        //se estiver sem o token(erro 403)dá o alert de token expirado, se for outro erro dá o alert de erro ao atualizar
        //se estiver indefinido ele vai página de cadastro de postagem
        if (id != undefined) {
            try {
                await atualizar(`/postagens`, postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                });

                toastAlerta('Postagem atualizada com sucesso', 'sucesso')

            } catch (error: any) {
                if (error.toString().includes('403')) {
                    toastAlerta('O token expirou, favor logar novamente', 'info')
                    handleLogout()
                } else {
                    toastAlerta('Erro ao atualizar a Postagem', 'erro')
                }
            }

        } else {
            try {
                await cadastrar(`/postagens`, postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                })

                toastAlerta('Postagem cadastrada com sucesso', 'sucesso');

            } catch (error: any) {
                if (error.toString().includes('403')) {
                    toastAlerta('O token expirou, favor logar novamente', 'info')
                    handleLogout()
                } else {
                    toastAlerta('Erro ao cadastrar a Postagem', 'erro');
                }
            }
        }

        setIsLoading(false)
        retornar()
    }


    //Só libera o botão 'confirmar' quando tudo estiver preenchido
    //'gerarNovaPostagem' if ternário verifica o id
    const carregandoTema = tema.descricao === '';

    return (
        <div className="container flex flex-col mx-auto items-center">
            <h1 className="text-4xl text-center my-8">
                {id !== undefined ? 'Editar Postagem' : 'Cadastrar Postagem'}
            </h1>
            <form className="flex flex-col w-1/2 gap-4" onSubmit={gerarNovaPostagem}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="titulo">Título da Postagem</label>
                    <input
                        value={postagem.titulo}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                        type="text"
                        placeholder="Insira aqui o Título"
                        name="titulo"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="titulo">Texto da Postagem</label>

                    <input
                        value={postagem.texto}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                        type="text"
                        placeholder="Adicione aqui o Texto da Postagem"
                        name="texto"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <p>Tema da Postagem</p>
                    <select name="tema" id="tema" className='border p-2 border-slate-800 rounded'
                        onChange={(e) => buscarTemaPorId(e.currentTarget.value)}
                    >
                        <option value="" selected disabled>Selecione um Tema</option>
                        {temas.map((tema) => (
                            <>
                                <option value={tema.id} >{tema.descricao}</option>
                            </>
                        ))}
                    </select>
                </div>
                <button
                    type='submit'
                    disabled={carregandoTema}
                    className='flex justify-center rounded disabled:bg-slate-200 bg-indigo-400 
                            hover:bg-indigo-800 text-white font-bold w-1/2 mx-auto py-2'
                >
                    {isLoading ?
                        <RotatingLines
                            strokeColor="white"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="24"
                            visible={true}
                        /> :
                        <span>Confirmar</span>
                    }
                </button>
            </form>
        </div>
);}

export default FormularioPostagem;