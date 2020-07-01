import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import '../css/Carregar.css'
import '../css/Efeitos.css'

const Carregar = (props) => {
    let className = classNames("material-icons rotacionar-infinito", '');
    let classNameParent = classNames('Carregar', props.className);
    return (
        <span 
            style={props.style} 
            title={props.title} 
            className={classNameParent}>
                <span>
                    <i className={className}>sync</i>
                    <span>{props.mensagem}</span>
                </span>
        </span>
    )
};

Carregar.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    mensagem: PropTypes.string,
}

Carregar.defaultProps = {
    title: "AGUARDE, ESTAMOS CARREGANDO",
    className: '',
    mensagem: 'CARREGANDO...',
    style: {},

}

export default Carregar;