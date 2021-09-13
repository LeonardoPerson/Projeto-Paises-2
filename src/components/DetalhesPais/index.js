import React, { useState, useEffect } from "react";
import { Header } from "../Layout/Header";
import axios from "axios";
import { Link } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from '@material-ui/lab/Pagination';

export const DetalhesPais = (props) => {
  const nome = props.match.params.name;
  const [atualizaNome, setAtualizaNome] = useState(nome);
  const [paisesDetalhes, setPaisDetalhes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [vizinhos, setVizinhos] = useState(null);
  const [vizinhosFinal, setVizinhosFinal] = useState([]);
  const arr = []

  //Paginação ----------------------------------------------------------------------------------------------------
  const itemsPerPage = 12;
  const totalPages = Math.ceil(vizinhosFinal.length / itemsPerPage);
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

  const buscaVizinhos = (border) => {
    setVizinhos(border.map(item => item.borders))
  }

  //Buscando os detalhes do país -------------------------------------------------------------------------------------
  useEffect(() => {
    setLoading(true)
    if (atualizaNome) {
      axios.get(`https://restcountries.eu/rest/v2/name/${atualizaNome}`)
        .then(res => {
          setPaisDetalhes(res.data)
          buscaVizinhos(res.data)
          setLoading(false)
        }).catch(res => {
          setErrorMessage("Informações não encontradas...");
          setLoading(false)
        })

    } else {
      setLoading(false)
    }

  }, [atualizaNome])

  //Buscando os vizinhos -------------------------------------------------------------------------------------------
  useEffect(() => {
    setLoading(true)
    console.log(vizinhos)
    if (vizinhos && vizinhos[0].length !== 0) {
      vizinhos.map(itemRaiz => (itemRaiz.map(itemVizinho => {
        return (
          axios.get(`https://restcountries.eu/rest/v2/alpha/${itemVizinho}`)
            .then(res => {
              setLoading(false)
              const flag = res.data.flag
              const getNome = res.data.name
              arr.push({ flag, getNome })
              if (vizinhos[0].length === arr.length) {
                setVizinhosFinal(arr)
              }
            }).catch(res => {
              setLoading(false)
              setErrorMessage("Informações não encontradas...");
            }))
      }
      )))
    } else {
      setErrorMessage("Não existem vizinhos para este país...")
      setLoading(false)
    }
  }, [vizinhos])

  //Atualizando os detalhes do país escolhido ------------------------------------------------------------------------
  const mostraPais = (item) => {
    setAtualizaNome(item)
  }

  return (
    <div>
      <Header />
      {loading ?
        <div className="p-5">
          <CircularProgress />
        </div>
        :
        paisesDetalhes && paisesDetalhes.map((item, index) =>
          <div key={index} className="d-flex flex-wrap p-5">
            <img src={item.flag} className="img-paises" alt={`Bandeira do país ${item.name}`}/>
            <div className="d-flex flex-column p-4">
              <div className="p-1">Nome: {item.name}</div>
              <div className="p-1">Capital: {item.capital}</div>
              <div className="p-1">Região: <Link to={`/${item.region}`}> {item.region} </Link></div>
              <div className="p-1">Sub-região: {item.subregion}</div>
              <div className="p-1">População: {item.population}</div>
              <div className="p-1">Línguas: {item.languages.map(item => item.name)}</div>
            </div>
          </div>
        )
      }

      <div className="textTitle p-5">Países Vizinhos</div>
      <div className="d-flex flex-wrap justify-content-center">
        {loading ?
          <CircularProgress /> :
          vizinhosFinal.length !== 0 ? vizinhosFinal
            .slice(posicaoInicialDaPagina, posicaoFinalDaPagina)
            .map((item, index) => (
              <div key={index}>
                <button className="button-vizinhos" onClick={() => mostraPais(item.getNome)} alt={`imagem da bandeira do país ${item.getNome}`}>
                  <img src={item.flag} className="img-paises bg-light m-3" alt={`Bandeira do país vizinho ${item.getNome}`}/>
                </button>
              </div>
            )
            )
            :
            <div className="errorMessage">{errorMessage}</div>
        }

      </div>
      {/*Paginação ---------------------------------------------------------------------------------------------- */}
      <div className="d-flex justify-content-center p-5">
        <Pagination
          count={noOfPages}
          page={page}
          onChange={handleChange}
          defaultPage={1}
          siblingCount={0}
          shape="rounded"
          className="pagination"
        />
      </div>
    </div>
  )
}