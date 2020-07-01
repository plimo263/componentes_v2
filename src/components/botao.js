import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
/** 
- Este componente é usado para dispor um botão bonito e interativo.
- Ele aceita propriedades como evento de clique, o titulo e seu conteudo.

*/


const Botao = (props) => {
    let className = classNames('Botao btn', props.className);

    return (
        <button 
            title={props.disabled ? 'DESABILITADO' : props.title} 
            disabled={props.disabled} 
            style={props.style} className={className} 
            onClick={props.onClick}>
            {props.children}
        </button>
    )
}

Botao.propTypes = {
    /** 
    Uma função de callback a ser acionada quando o botão for clicado 
    */
    onClick: PropTypes.func,
    /** Um titulo para o botão, este será exibido quando o mouse ficar sobre o botão */
    title: PropTypes.string,
    /** Um valor boleano (true|false) que determina se o botão deve ser clicavel ou não */
    disabled: PropTypes.bool,
    /** Um objeto literal com propriedades css  */
    style: PropTypes.object,
    /** Uma string que contém as classes a serem inclusas no botão */
    className: PropTypes.string,
}

Botao.defaultProps = {
    onClick: ()=>{},
    title: 'CLIQUE AQUI',
    disabled: false,
    style: {},
    className: '',
}

export default Botao;