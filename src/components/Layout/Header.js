import React from 'react';
import logo from "../../assets/imagem/logo.jpg";
import zerezes from "../../assets/imagem/zerezes.png";
import { Link } from "react-router-dom";
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';

export const Header = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg header d-flex flex-nowrap justify-content-between ">

        <img src={logo} alt="Logo Zerezes" className="logo-zerezes img-fluid" />
        <button className="button-zerezes">
          <img src={zerezes} alt="texto zerezes" className="text-zerezes img-fluid" />
        </button>


        <div className="d-flex align-items-center">
          <Link to="/" className="navbar-nav navbar-toggler header-voltar-mobile" data-toggle="collapse">
            <KeyboardReturnIcon fontSize="large" className="nav-item" />
          </Link>

          <div className="d-flex justify-content-end p-5">
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link to="/" className="navbar-nav header-voltar d-flex justify-content-around align-items-center">
                    <KeyboardReturnIcon fontSize="medium" className="nav-item" />
                    <div className="texto-voltar nav-item">Voltar</div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
