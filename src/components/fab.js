import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import '../css/Efeitos.css';
/**
Um botão flutuante posicionado na parte inferior para ações
comuns.

- Você pode alterar a forma como o botão se posiciona passando um style
- Dê um titulo passando a props title
- Defina um icone passando a propriedade icon
*/

function Fab({disabled, rotate, icon, title, style, onClick}){
    const styleInner = Object.assign({}, style, disabled ? {opacity: '.7'} : {});
    const className = ClassNames("d-flex flex-ai-center flex-jc-center",
        {
            'rotacionar-infinito': rotate
         }
    )
    return (
        <button disabled={disabled} 

            className={className}
            onClick={onClick} 
            title={title} style={{
                ...styles, 
                ...styleInner
            }}
            
        >
            <i className="material-icons">{icon}</i>
        </button>
    )
};
//
Fab.propTypes = {
    /** Define um nome de icone */
    icon: PropTypes.string,
    /** Uma função de callback que será acionada ao clicar no icone */
    onClick: PropTypes.func.isRequired,
    /** Estilos que podem ser passados ao botao */
    style: PropTypes.object,
    /** Titulo que será exibido no botão quando o mouse ficar posicionado acima */
    title: PropTypes.string,
    /** Define se o botão deve ficar desabilitado */
    disabled: PropTypes.bool,
    /** Determina se o icone dentro do botão deve rotacionar, isto é usado em casos de sincronismo (icon=sync) */
    rotate: PropTypes.bool,
}
//
Fab.defaultProps = {
    icon: 'add',
    style: {},
    title: 'CLIQUE AQUI'
}
const styles = {
    cursor: 'pointer',
    position: 'fixed',
    bottom: '15px',
    right: '15px',
    boxShadow: '0 0 8px #000',
    borderRadius: '50%',
    padding: '10px',
    backgroundColor: "rgba(178,34,34)",
    opacity: '1',
    color: 'white',
    fontWeight: 'bold',
    borderWidth: '0px',
    outline: 'none',
};

export default Fab;