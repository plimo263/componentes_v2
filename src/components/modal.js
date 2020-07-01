import React from 'react'
import classNames from 'classnames'
import Botao from './botao'
import '../css/Modal.css'

class Modal extends React.Component {

    constructor(){
        super();

        this._fnFechar = this.fnFechar.bind(this);
    }
    static defaultProps = {
        className: '',
        modalPequeno: false,
        modalGrande: false,
        titulo: 'MODAL',
        style: {}
    }
    
    render(){
        let className = classNames('Modal', this.props.className);
        
        className = classNames(className, {
            'modal-pequeno': (this.props.modalPequeno && !this.props.modalGrande) || false,
            'modal-grande': (this.props.modalGrande && !this.props.modalPequeno) || false
        });
        return (
            <div className="Modal-geral">
                <div style={this.props.style} className={className}>
                    <div className="modal-cabe">
                        {this.props.titulo}
                    </div>
                    <div className="modal-corpo">
                    {
                        this.props.children
                    }
                    </div>
                    <div className='modal-rodape'>
                        <div></div>
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

export default Modal;