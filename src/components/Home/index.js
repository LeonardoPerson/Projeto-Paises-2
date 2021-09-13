import React, { useState, useEffect } from "react";
import { Header } from "../Layout/Header";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from "react-router-dom";
import Pagination from '@material-ui/lab/Pagination';

export const Home = (props) => {
  const regiao = props.match.params.region;
  const menuInicial = ["Região", "Capital", "Língua", "País", "Código de ligação"];
  const error = "Não foi possível buscar as informações, tente novamente..."
  const masculino = "um";
  const feminino = "uma"
  const valorDefault = "Escolha uma opção";
  const regiaoParam = regiao;
  const [filtro, setFiltro] = useState("");
  const [menuSedundario, setMenuSecundario] = useState(null);
  const [paises, setPaises] = useState(null);
  const [resultadoPaises, setResultadoPaises] = useState("");
  const [regiaoLista, setRegiaoLista] = useState(null);
  const [capitalLista, setCapitalLista] = useState(null);
  const [linguaLista, setLinguaLista] = useState(null);
  const [linguaCode, setLinguaCode] = useState(null);
  const [paisLista, setPaisLista] = useState(null);
  const [codigoLigacao, setCodigoLigacao] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [escolhaFiltroInicial, setEscolhaFiltroInicial] = useState("");
  const [escolhaFiltroInicialEnglish, setEscolhaFiltroInicialEnglish] = useState("");
  const [escolhaFiltroFinal, setEscolhaFiltroFinal] = useState("");
  const [loading, setLoading] = useState(true);

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
    const busca = menuInicial.find(item => item === evt.target.value);
    //Executando a verificação de gênero em conjunto com a opção selecionada
    verificaGenero(busca);
  }

  //Obtendo a opção final selecionada no segundo filtro -----------------------------------------------------
  const opcaoFinalSelecionada = (evt) => {
    evt.preventDefault();
    if (filtro === "Língua") {
      let buscaLanguage = paises.map(item => item.languages)
      let comparaLanguage = buscaLanguage.map(item => item.find(item => item.name === evt.target.value && item.iso639_1))
      let buscaCodigo = comparaLanguage.filter(item => item !== undefined)
      setEscolhaFiltroFinal(evt.target.value);

      setLinguaCode(buscaCodigo[0].iso639_1);
    } else {
      setEscolhaFiltroFinal(evt.target.value);
    }
  }

  //Buscas relacionadas à cada item do primeiro filtro --------------------------------------------------------
  const buscaRegioes = (regioes) => {
    const resultado = regioes.map(item => item.region);
    setRegiaoLista([...new Set(resultado)].sort());
  }

  const buscaCapital = (capital) => {
    const resultado = capital.map(item => item.capital);
    setCapitalLista([...new Set(resultado)].sort());
  }

  const buscaLinguas = (linguas) => {
    const resultadoFinal = []
    const resultado = linguas.map(item => item.languages.map(item => item.name));
    for (let i = 0; i < resultado.length; i++) {
      for (let j = 0; j < resultado[j].length; j++) {
        resultadoFinal.push(resultado[i][j]);
      }
    }
    setLinguaLista([...new Set(resultadoFinal)].sort());
  }

  const buscaPais = (pais) => {
    const resultado = pais.map(item => item.name);
    setPaisLista([...new Set(resultado)]);
  }

  const buscaCodigoLigacao = (codigoLigacao) => {
    const resultadoFinal = [];
    const resultado = codigoLigacao.map(item => item.callingCodes);
    for (let i = 0; i < resultado.length; i++) {
      for (let j = 0; j < resultado[j].length; j++) {
        if (resultado[i][j]) {
          resultadoFinal.push(parseInt(resultado[i][j]));
        }
      }
    }
    setCodigoLigacao([...new Set(resultadoFinal)].sort((a, b) => a - b))
  }


  //Buscando as informações iniciais de países --------------------------------------------------------------
  useEffect(() => {
    setLoading(true)
    axios.get("https://restcountries.eu/rest/v2/all")
      .then(res => {
        setPaises(res.data);
        setResultadoPaises(res.data);
        buscaRegioes(res.data);
        buscaCapital(res.data);
        buscaLinguas(res.data);
        buscaPais(res.data);
        buscaCodigoLigacao(res.data);
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
      setMenuSecundario(regiaoLista);
    }
    if (escolha === "Capital") {
      setEscolhaFiltroInicialEnglish("capital");
      setMenuSecundario(capitalLista);
    }
    if (escolha === "Língua") {
      setEscolhaFiltroInicialEnglish("lang");
      setMenuSecundario(linguaLista);

    }
    if (escolha === "País") {
      setEscolhaFiltroInicialEnglish("name");
      setMenuSecundario(paisLista);
    }
    if (escolha === "Código de ligação") {
      setEscolhaFiltroInicialEnglish("callingcode");
      setMenuSecundario(codigoLigacao);
    }
  }

  //Abastecimento do menu secundário sempre que um primeiro filtro é escolhido ------------------------------
  useEffect(() => {
    if (filtro) {
      criaMenuSecundario(filtro);
    }
  }, [filtro]);

  //Pesquisando pela escolha dos dois filtros ---------------------------------------------------------------------------------------
  const pesquisaEscolha = () => {
    setLoading(true);
    let busca = ""
    if (escolhaFiltroInicialEnglish === "lang") {
      busca = linguaCode
    } else {
      busca = escolhaFiltroFinal
    }
    axios.get(`https://restcountries.eu/rest/v2/${escolhaFiltroInicialEnglish}/${busca}`)
      .then(res => {
        setResultadoPaises(res.data);
        setLoading(false);
      }).catch(res => {
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
        setMenuSecundario(regiaoLista);
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
      <div className="container p-5">
        <div className="row">
          <div className="col-sm p-3">
            <div className="text-start">Filtrar por</div>
            <Dropdown className="d-flex justify-content-start border-bottom">
              <Dropdown.Toggle className="dropdown">{filtro || valorDefault}</Dropdown.Toggle>
              <Dropdown.Menu>
                {menuInicial.map((item, index) => (
                  <Dropdown.Item className="dropdownItem" as="button" key={index} value={item} onClick={opcaoInicialSelecionada}>
                    {item}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>


          {/*Segundo filtro com base no primeiro ---------------------------------------------------------- */}
          <div className="col-sm p-3">
            {
              filtro &&
              <div>
                <div className="text-start">{filtro}</div>
                <Dropdown className="d-flex justify-content-start border-bottom">
                  <Dropdown.Toggle className="dropdown">{escolhaFiltroFinal ? escolhaFiltroFinal : escolhaFiltroInicial}</Dropdown.Toggle>
                  <Dropdown.Menu className="">
                    {menuSedundario && menuSedundario.map((item, index) => (
                      <Dropdown.Item className="dropdownItem" as="button" key={index} value={item} onClick={opcaoFinalSelecionada}>
                        {item}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            }
          </div>

          {/*Botao para pesquisa com base nos filtros anteriores ------------------------------------------- */}
          <div className="col-sm d-flex justify-content-end justify-content-md-center p-4">
            <button className="button-pesquisar px-5 py-2" onClick={pesquisaEscolha}>PESQUISAR</button>
          </div>
        </div>
      </div>

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
