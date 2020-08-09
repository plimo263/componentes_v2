import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Botao from './botao';
import '../css/Modal.css';

/**
 * Este componente tem como objetivo exibir um modal com algum conteúdo que 
 * o desenvolvedor informe. É obrigatório passar uma função para fechar o modal.
 */
class Modal extends React.Component {

    constructor(){
        super();
        this._fnFechar = this.fnFechar.bind(this);
    }    
    render(){
        const {
            style, styleCorpo, styleTitulo, styleRodape,
            className, modalGrande, modalPequeno,
            modalFull,
        } = this.props;

        let classNameT = classNames('Modal', className);
        // Se o modalFull esta ativo ele tem precedencia nas outras classes
        if(modalFull){
            classNameT = classNames(classNameT, 'modal-full');
        } else {
            classNameT = classNames(classNameT, {
                'modal-pequeno': (modalPequeno && !modalGrande) || false,
                'modal-grande': (modalGrande && !modalPequeno) || false
            });
        }

        return (
            <div className="Modal-geral">
                <div style={style} className={classNameT}>
                    <div className="modal-rodape">
                        {this.props.onFechar ? <i 
                            title="FECHAR MODAL" style={{fontSize: '16px', position: 'absolute', top: 0, right: 0}}
                            className='material-icons icone-redondo' 
                            onClick={this.props.onFechar}>close</i> : null}
                    </div>
                    <div style={styleTitulo} className="modal-cabe">
                        {this.props.titulo}
                    </div>
                    <div style={styleCorpo} className="modal-corpo">
                        {this.props.children}
                    </div>
                    <div style={styleRodape} className='modal-rodape'>
                        {/* <div></div> */}
                        {this.props.onFechar ? <Botao className='btn-xs btn-danger' onClick={this.props.onFechar}>FECHAR</Botao> : null}
                    </div>
                </div>
            </div>
        )
    }

    fnFechar(e){
        if(e.keyCode === 27) this.props.onFechar();
    }
    componentDidMount(){
        // Alterando o tamanho inicial de exibição do modal
       let tamanho = document.querySelector('.Modal').clientHeight + 56;
       document.querySelector('.Modal-geral').style.height = tamanho+'px';

       // Ligar evento de fechar modal com esc
       // Adicionar evento da tecla esc para fechar modal
       window.addEventListener('keyup', this._fnFechar);
    }

    componentWillUnmount(){
        // Retira o evento keyUp que foi incluso para atender o modal
        // Retirar o evento
        window.removeEventListener('keyup', this._fnFechar);
    }
}

Modal.defaultProps ={
    className: '',
    modalPequeno: false,
    modalGrande: false,
    titulo: 'MODAL',
    style: {},
    styleCorpo: {},
    styleTitulo: {},
    styleRodape: {},
}

Modal.propTypes = {
    /** Função de callback para fechar o modal */
    onFechar: PropTypes.func.isRequired,
    /** Um booleano que exibe o modal no tamanho máximo */
    modalFull: PropTypes.bool,
    /** Classes informadas por strings */
    className: PropTypes.string,
    /** Booleano que determina se o modal deve ser pequeno */
    modalPequeno: PropTypes.bool,
    /** Booleano que determina se o modal deve ser grande */
    modalGrande: PropTypes.bool,
    /** Um texto para ser exibido no titulo do modal */
    titulo: PropTypes.any,
    /** Um estilo para ser aplicado na moldura do modal */
    style: PropTypes.object,
    /** Um estilo para ser aplicado na moldura do cabecalho do modal */
    styleTitulo: PropTypes.object,
    /** Um estilo para ser aplicado no corpo do modal */
    styleCorpo: PropTypes.object,
    /** Um estilo para ser aplicado ao rodape do modal */
    styleRodape: PropTypes.object,
}

export default Modal;