
import React from 'react'
import PropTypes from 'prop-types'
import ClassNames from 'classnames'
import '../css/Tab.css'
import Fade from './fade'
/**
Este componente é capaz de representar abas no site fazendo transições 
de esmaecimento a medida que se alterna entre as telas.
*/
class Tab extends React.Component {

    constructor(){
        super();

        this.state = {
            ativo: null
        }
    }
    // Para receber atualizacao da propriedade e atualizar o estado
    UNSAFE_componentWillReceiveProps(props){
        let {ativo} = props;
        if(ativo) this.setState({ativo});
    }
    render(){
        let classNameCorpo = ClassNames(this.props.classNameCorpo, 'tab-react-corpo');
        let ativo = this.state.ativo ? this.state.ativo : this.props.ativo;
        
        return (
            <div className="Tab-react">
                {this._renderCabe()}
                <div className={classNameCorpo}>
                
                <div className="corpo-idx" key={ativo}>
                    <Fade>{this._renderCorpo()}</Fade>
                </div>
                </div>                
            </div>
        )
    }

    _renderCabe(){
        const {modo, cracha, cabe, crachaTitulo} = this.props;

        let className = ClassNames(this.props.classNameCabe, {
            'tab-react-cabe-slide' : modo === 'slide',
            'tab-react-cabe' : modo !== 'slide',
        });
        let ativo = this.state.ativo || this.props.ativo;
        
        return (
            <div className={className}>
                {
                    cabe.map((ele,idx)=>{
                        // Se for a aba ativa determina o modo ativo 
                        const className = (idx === ativo) ? `cabe-idx-${modo} ${modo}` : `cabe-idx-${modo}`;
                        const titulo = crachaTitulo && crachaTitulo[idx] ? crachaTitulo[idx] : null
                        return (
                            <span title={titulo} style={{position: 'relative'}} className={className} onClick={this._onClick.bind(this)} data-idx={idx} key={idx}>
                                {/** Existe o cracha na posicao solicitada ? Crie-o entao*/}
                                {cracha && cracha[idx] ? <span className='cracha'>{cracha[idx]}</span> : null}
                                {ele}
                            </span>
                        )
                    })

                }
                
            </div>
        )
    }
    // Este metodo renderiza o indicador do TAB
    _renderIndicadorCabe(){
        let {ativo} = this.state;
        return (
            <div className="tab-indicador-cabe">
                {
                    this.props.cabe.map((ele,idx)=>{
                        let className = ClassNames({
                            'tab-indicador-ativo': idx === ativo,
                            'tab-indicador-oculto': idx !== ativo
                        })
                        return (
                            <span className={className} key={idx}>
                                <i className="material-icons">arrow_drop_up</i>
                            </span>
                        )
                    })

                }
            </div>
        )
    }

    _renderCorpo(){
        let ativo = this.state.ativo || this.props.ativo;
        let ele = this.props.corpo[ativo];
        return (ele);
    }
    // Evento de click que altera entre os conteudos
    _onClick(e){
        let item;
        let tag = e.target;
        let modo = this.props.modo;
        while(true){  
            // Procura pela classe 'cabe-idx' assim sabe que a tag clicada é a do cabecalho que contem  o idx
            if([...tag.classList].includes(`cabe-idx-${modo}`)){
                item = parseInt(tag.dataset.idx);
                break;
            } else {
                tag = tag.parentNode;
            }
        }
        // Chama um callback sempre que o tab for alternado
        this.props.callBackItem && this.props.callBackItem.hasOwnProperty(item) && this.props.callBackItem[item]();
        this.setState({ ativo: item });
    }
}

Tab.defaultProps = {
    modo: 'ativo',
    ativo: 0,
    classNameCorpo: '',
    classNameCabe: '',
}

Tab.propTypes = {
    /** Define o modo de exibição da aba. */
    modo: PropTypes.oneOf(['mobile', 'ativo', 'slide']).isRequired,
    /** Classe css para o cabecalho */
    classNameCabe: PropTypes.string,
    /** Classe css para o corpo */
    classNameCorpo: PropTypes.string,
    /** Define qual a aba ativa no momento*/
    ativo: PropTypes.number.isRequired,
    /** Um array com itens que representam o cabecalho, pode ser qualquer item */
    cabe: PropTypes.array.isRequired,
    /** Um array com o corpo de cada cabecalho, ele precisa ter o mesmo tamanho do cabecalho */
    corpo: PropTypes.array.isRequired,
    /** Um array em que cada posição é algo que você deseja representar na cabeça das abas. Pode ser números ou outras coisas. */
    cracha: PropTypes.array,
    /** Um array com titulos que podem ser inseridos nas abas. */
    crachaTitulo: PropTypes.array,
}

export default Tab