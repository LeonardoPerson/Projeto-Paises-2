import React from 'react';
import movaLogo from "../../assets/imagem/movaLogo.png";
import { Link } from "react-router-dom";
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';

export const Header = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg header d-flex justify-content-between">

        <img src={movaLogo} alt="Logo Mova" className="logo-mova" />

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
