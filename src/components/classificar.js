import React from 'react'
import PropTypes from 'prop-types';
// Importando componentes
import Modal from './modal';
import Fade from './fade';
import EntradaForm from './entrada-form';
import Logo from './logo';

const TEXTO_CLASSIFICACAO = [
    'SEM CLASSIFICAÇÃO',
    'PÉSSIMO', 'RUIM',
    'REGULAR', 'BOM',
    'ÓTIMO'
];


class Classificar extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            onRating: this.props.ratingValue,
            rating: null,
        }

    }

    componentWillReceiveProps(nextProps){
        this.setState({onRating: nextProps.ratingValue});
    }
    
    // Funcao para colorir a estrela
    _onMouseOver(e){
        this.setState({onRating: e.target.dataset.idx});
    }
    // Funcao para definir rating
    _onMouseOut(e){
        this.setState({onRating: this.props.ratingValue});
    }
    // Funcao para salvar classificacao
    _onClick(e){
        const rating = e.target.dataset.idx;
        this.setState({rating})
    }
    // FUncao para submeter os dados
    _onSubmit(e){
        e.preventDefault(); // Previne envio do formulario
        let valor = this.getValues().map(ele=> ele.value);
        // Passa o valor a funcao que foi enviada acima para 
        // tratar os dados
        this.props.fn(valor);
        
    }

    render(){
        const {rating} = this.state;
                
        return <Fade>{rating ? this._renderModal() : this._renderRating()}</Fade>
    }
    // Renderiza o modal
    _renderModal(){
        // Recebe aguardar e erro 
        const {aguardar, erro} = this.props;
        // Schema default
        const schema = [
            {
                type: 'hidden',
                defaultValue: this.state.rating,

            },
            {
                type: 'textarea',
                placeholder: 'CONTE-NOS PORQUE CHEGOU A ESTA NOTA...',
                opt: {rows: 10},
                defaultValue: '',
                required: true,
                disabled: false,
            }
        ];
        // Cabecalho para o modal
        const cabe = <div className="bg-red pad-5 bor-rad-5 d-flex flex-ai-center flex-jc-between">
            <Logo />
            <h5 className='text-white'>O QUE VOCÊ ACHOU ?</h5>
        </div>
        // Retorna o modal com o formulario
        return (
            <Modal titulo={cabe} onFechar={()=> this.setState({rating: null})}>
                <h4 className='d-flex flex-ai-center flex-jc-center'> {this._renderRating()}</h4>
                <EntradaForm classNameBotao='bg-red text-white text-bold' 
                    fn={this.props.onSubmit} modo='mobile' 
                    onSubmit={this._onSubmit} schema={schema} 
                    aguardar={aguardar} erro={erro}
                />
            </Modal> 
        )
    }
    // Classificacao
    _renderRating(){
        // Recuperando o aguardar
        const {aguardar} = this.props;

        const {onRating, rating} = this.state;
        //
        let estrelas = rating || onRating;
        // Estilo
        const style = {cursor: aguardar ? 'not-allowed': 'pointer'};
        // Determinação das funções
        const mouseOut = aguardar ? ()=> {} : this._onMouseOut.bind(this);
        const mouseOver = aguardar ? ()=>{} : this._onMouseOver.bind(this);
        const onClick = aguardar ? ()=>{window.alert('NÃO É POSSÍVEL CLASSIFICAR NO MOMENTO')} : this._onClick.bind(this);
        
        return (
        <span className='d-flex d-flex-column flex-ai-center'>
                <span style={style}>
                    { [1,2,3,4,5].map(ele=>{
                        // Estilo das estrelas
                        const style = estrelas >= ele ? { color: 'gold' } : { color: 'black'};
                        // Defina o titulo
                        const title = (!aguardar ? 
                            TEXTO_CLASSIFICACAO[estrelas] :
                            'CLASSIFICAÇÃO INDISPONÍVEL NO MOMENTO'
                        );

                        return ( 
                            <i title={title} 
                                key={ele} data-idx={ele} 
                                style={style}
                                className="material-icons" 
                                onMouseOut={mouseOut}
                                onMouseOver={mouseOver}
                                onClick={onClick}
                            >
                                { estrelas >= ele ? 'star' : 'star_border' }
                            </i>
                        )
                        })
                    }
                </span>
                {this.props.noLabel ? null : <span>{TEXTO_CLASSIFICACAO[estrelas]}</span>}
        </span>
        )
    }
};

// Propriedades default
Classificar.defaultProps =  {
    ratingValue: 0,
    erro: '',
    aguardar: false,
};

Classificar.propTypes = {
    /** 
    ** Uma função de callback que irá receber um array com 2 itens
        - 0 => número de estrelas que foi escolhido pelo usuário.
        - 1 => a mensagem digitada no campo de entrada do formulário.
    ** A função que você precisa enviar tem a seguinte aparência
        - onSubmit(val: Array)=> {}
    */
    onSubmit: PropTypes.func.isRequired,
    /** Uma string que represente uma mensagem que você queira exibir após o envio dos dados (ou antes). */
    erro: PropTypes.string,
    /** Um booleano que determina um botão giratório dentro do botão enviar, isto trava os outros campos de formulario */
    aguardar: PropTypes.bool,
    /** Um número (de 1 até 5) para determinar quantas estrelas foram marcadas */
    ratingValue: PropTypes.number,
    /** Um booleano que determina se o rotulo (texto abaixo das estrelas) será exibido ou não */    
    noLabel: PropTypes.bool,

};

export default Classificar;