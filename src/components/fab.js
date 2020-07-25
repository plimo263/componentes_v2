import React from 'react';
import PropTypes from 'prop-types';
/**
Um botão flutuante posicionado na parte inferior para ações
comuns.

- Você pode alterar a forma como o botão se posiciona passando um style
- Dê um titulo passando a props title
- Defina um icone passando a propriedade icon
*/

function Fab({icon, title, style, onClick}){
    return (
        <span className='d-flex flex-ai-center flex-jc-center' onClick={onClick} title={title} style={{...styles, ...style}}>
            <i className="material-icons">{icon}</i>
        </span>
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
    boxShadow: '0 12px 8px #ccc',
    borderRadius: '50%',
    padding: '10px',
    backgroundColor: 'firebrick',
    color: 'white',
    fontWeight: 'bold',
};

export default Fab;