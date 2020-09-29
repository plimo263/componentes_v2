import React from 'react'
import PropTypes from 'prop-types';
import Logo from './logo';
/**
 * Este é um componente para complementar o modal
 * 
 */
function CabeModal(props){
    return (
        <div style={props.style} className="bg-red bor-rad-15 pad-5 d-flex flex-ai-center flex-jc-between">
            <Logo />
            {props.children}
        </div>
    )
}
CabeModal.defaultProps = {
    style: {},
}

CabeModal.propTypes = {
    /** Algo que vai ficar a extrema direita do cabecalho.*/
    children: PropTypes.any,
    /** Um objeto style que pode ser aplicado */
    style: PropTypes.object,
}

export default CabeModal