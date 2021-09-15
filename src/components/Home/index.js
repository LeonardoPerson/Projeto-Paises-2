import React, { useState, useEffect } from "react";
import { Header } from "../Layout/Header";
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from "react-router-dom";
import Pagination from '@material-ui/lab/Pagination';
import { Form } from "react-bootstrap";

export const Home = (props) => {
  const regiao = props.match.params.region;
  const menuInicial = ["Região", "Capital", "Língua", "País", "Código de ligação"];
  const error = "Não foi possível buscar as informações, tente novamente..."
  const masculino = "um";
  const feminino = "uma"
  const regiaoParam = regiao;
  const minimoParaBuscarTermo = 3;
  const [filtro, setFiltro] = useState("");
  const [paises, setPaises] = useState(null);
  const [resultadoPaises, setResultadoPaises] = useState("");
  const [regiaoLista, setRegiaoLista] = useState(null);
  const [linguaCode, setLinguaCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [escolhaFiltroInicial, setEscolhaFiltroInicial] = useState("");
  const [tipoFiltroDigitado, setTipoFiltroDigitado] = useState("");
  const [buscaTermoDigitado, setBuscaTermoDigitado] = useState("");
  const [avisoInicial, setAvisoInicial] = useState("");
  const [avisoFinal, setAvisoFinal] = useState("");
  const [escolhaFiltroInicialEnglish, setEscolhaFiltroInicialEnglish] = useState("");
  const [escolhaFiltroFinal, setEscolhaFiltroFinal] = useState("");
  const [loading, setLoading] = useState(true);

  console.log(paises)

  //Paginação ----------------------------------------------------------------------------------------------------
  const itemsPerPage = 12;
  const totalPages = Math.ceil(resultadoPaises.length / itemsPerPage);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(null);
  const posicaoInicialDaPagina = (page - 1) * itemsPerPage;
  const posicaoFinalDaPagina = page * itemsPerPage;

  const handleChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    if (totalPages) {
      setNoOfPages(totalPages)
    }
  }, [totalPages])

  //verificando o gênero da escolha do primeiro filtro para a correta exibição no segundo filtro ----------------
  const verificaGenero = (valorDoFiltro) => {
    if (valorDoFiltro) {
      setFiltro(valorDoFiltro)
      if (valorDoFiltro === "Região" || valorDoFiltro === "Capital" || valorDoFiltro === "Língua") {
        setEscolhaFiltroInicial("Escolha " + feminino + " " + valorDoFiltro.toLowerCase());
        setEscolhaFiltroFinal("")
      } else {
        setEscolhaFiltroInicial("Escolha " + masculino + " " + valorDoFiltro.toLowerCase());
        setEscolhaFiltroFinal("")
      }
    }
  }

  //Obtendo a opção selecionada no primeiro filtro ----------------------------------------------------------
  const opcaoInicialSelecionada = (evt) => {
    evt.preventDefault();
    const termo = evt.target.value;
    setTipoFiltroDigitado(termo)
    setAvisoInicial("");
    setAvisoFinal("");
    setEscolhaFiltroFinal("");
    setBuscaTermoDigitado("");
    if (termo.length >= minimoParaBuscarTermo) {
      let busca = menuInicial.find(item => item.toLowerCase() === termo.trim().toLowerCase());
      if (busca) {
        setAvisoInicial("");
        verificaGenero(busca);
      } else {
        setFiltro("");
        setAvisoInicial("Sem resultados...");
      }
    }
    //Executando a verificação de gênero em conjunto com a opção selecionada
  }

  //Obtendo a opção final selecionada no segundo filtro -----------------------------------------------------
  const opcaoFinalSelecionada = (evt) => {
    evt.preventDefault();
    const termo = evt.target.value;
    setBuscaTermoDigitado(termo);
    if (filtro === "Língua") {
      let buscaLanguage = paises.map(item => item.languages)
      let comparaLanguage = buscaLanguage.map(item => item.find(item => item.name.toLowerCase() === termo.trim().toLowerCase() && item.iso639_1))
      let buscaCodigo = comparaLanguage.filter(item => item !== undefined)
      setEscolhaFiltroFinal(termo);
      let buscaCod = buscaCodigo[0] ? buscaCodigo[0].iso639_1 : "";
      setLinguaCode(buscaCod);

    } else if (termo && termo.toLowerCase() === "áfrica") {
      setEscolhaFiltroFinal("africa")

    } else if (termo && termo.toLowerCase() === "europa") {
      setEscolhaFiltroFinal("europe")
     
    } else if (termo && termo.toLowerCase() === "ásia") {
      setEscolhaFiltroFinal("asia");
    } else if (termo && termo.toLowerCase() === "américa"){
      setEscolhaFiltroFinal("americas");
    } else {
      setEscolhaFiltroFinal(termo);
    }
  }

  //Buscas relacionadas à cada item do primeiro filtro --------------------------------------------------------
  const buscaRegioes = (regioes) => {
    const resultado = regioes.map(item => item.region);
    setRegiaoLista([...new Set(resultado)].sort());
  }   

  //Buscando as informações iniciais de países --------------------------------------------------------------
  useEffect(() => {
    setLoading(true)
    axios.get("https://restcountries.eu/rest/v2/all")
      .then(res => {
        setPaises(res.data);
        setResultadoPaises(res.data);
        buscaRegioes(res.data);       
        setLoading(false);
      }).catch(res => {
        setErrorMessage(error);
        setLoading(false);
      })
  }, []);

  //Identifica a escolha do primeiro filtro e abastece o menu secundário ----------------------------------------------------------------------------
  const criaMenuSecundario = (escolha) => {
    if (escolha === "Região") {
      setEscolhaFiltroInicialEnglish("region");
    }
    if (escolha === "Capital") {
      setEscolhaFiltroInicialEnglish("capital");
    }
    if (escolha === "Língua") {
      setEscolhaFiltroInicialEnglish("lang");

    }
    if (escolha === "País") {
      setEscolhaFiltroInicialEnglish("name");
    }
    if (escolha === "Código de ligação") {
      setEscolhaFiltroInicialEnglish("callingcode");
    }
  }

  //Abastecimento do menu secundário sempre que um primeiro filtro é escolhido ------------------------------
  useEffect(() => {
    if (filtro) {
      criaMenuSecundario(filtro);
    }
  }, [filtro]);

  //Pesquisando pela escolha dos dois filtros ---------------------------------------------------------------------------------------
  const pesquisaEscolha = (evt) => {
    evt && evt.preventDefault();
    setLoading(true);
    let busca = ""
    if (escolhaFiltroInicialEnglish === "lang") {
      busca = linguaCode
    } else {
      busca = escolhaFiltroFinal
    }
    axios.get(`https://restcountries.eu/rest/v2/${escolhaFiltroInicialEnglish}/${busca}`)
      .then(res => {
        setAvisoFinal("")
        setResultadoPaises(res.data);
        setLoading(false);
      }).catch(res => {
        if (res.response.status === 404) {
          setAvisoFinal("Sem resultados...");
        }     
        setErrorMessage(error)
        setLoading(false);
      })
  }

  //Configurações do retorno da página de detalhes para a página inicial -------------------------------------------
  useEffect(() => {
    setLoading(true)
    if (regiaoParam) {
      setFiltro("Região");
      setEscolhaFiltroFinal(regiaoParam);
      setLoading(false)
      if (regiaoLista) {
        pesquisaEscolha();
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [regiaoParam, regiaoLista]);

 

  return (
    <div>
      <Header />
      {/*Primeiro filtro --------------------------------------------------------------------------------- */}
      <Form className="p-5">
        <div className="container">
          <div className="row mt-5 mb-5 d-flex flex-wrap">
            <div className="col-md-4 col-sm-12 col-xs-12 mt-3 mb-3">
              <Form.Group>
                <Form.Label>Escolha um tipo de filtro:</Form.Label>
                <Form.Control
                  placeholder="Região, capital, língua, país ou código de ligação."
                  value={tipoFiltroDigitado}
                  onChange={opcaoInicialSelecionada}
                  type="text"
                  className="input-filtro"
                >
                </Form.Control>
              </Form.Group>
              <div className="text-mensagem-busca">
                {avisoInicial}
              </div>
            </div>


            {/*Segundo filtro com base no primeiro ---------------------------------------------------------- */}
            <div className="col-md-4 col-sm-12 col-xs-12 mt-3 mb-3">
              {
                filtro &&
                <Form.Group className="d-flex flex-column align-items-between">
                  <Form.Label>{filtro}</Form.Label>
                  <Form.Control
                    placeholder={escolhaFiltroFinal ? escolhaFiltroFinal : escolhaFiltroInicial}
                    value={buscaTermoDigitado}
                    onChange={opcaoFinalSelecionada}
                    type="text"
                    className="input-filtro"
                  >
                  </Form.Control>
                  <div className="text-mensagem-busca">
                    {avisoFinal}
                  </div>
                </Form.Group>
              }
            </div>

            {/*Botao para pesquisa com base nos filtros anteriores ------------------------------------------- */}

            <div className="col-md-4 col-sm-12 col-xs-12 mt-3 mb-3 d-flex justify-content-center align-items-center">
              <button className="button-pesquisar px-5 py-2" onClick={pesquisaEscolha}>PESQUISAR</button>
            </div>

          </div>
        </div>
      </Form>

      {/*Exibição das bandeiras dos países------------------------------------------------------------- */}
      <div className="container">
        <div className="row">
          {
            loading ?
              <CircularProgress />
              :
              resultadoPaises ? resultadoPaises
                .slice(posicaoInicialDaPagina, posicaoFinalDaPagina)
                .map((item, index) => (
                  <div key={index} className="col d-flex justify-content-around">
                    <Link to={`/detalhes-pais/${item.name}`}>
                      <img src={item.flag} alt={`Bandeira do país ${item.name}`} className="img-paises mb-5" />
                    </Link>
                  </div>
                ))
                :
                (<div className="errorMessage">{errorMessage}</div>)
          }
        </div>
      </div>

      {/*Paginação ---------------------------------------------------------------------------------------------- */}
      <div className="d-flex justify-content-center flex-nowrap p-5">
        <Pagination
          count={noOfPages}
          page={page}
          onChange={handleChange}
          defaultPage={1}
          siblingCount={0}
          showLastButton={false}
          shape="rounded"
          className="pagination"
        />
      </div>
    </div>
  )
}
