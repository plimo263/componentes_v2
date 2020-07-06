import React from 'react'
import PropTypes from 'prop-types';

const TEXTO_CLASSIFICACAO = [
    'SEM CLASSIFICAÇÃO',
    'PÉSSIMO', 'RUIM',
    'REGULAR', 'BOM',
    'ÓTIMO'
];


class Avaliador extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            onRating: this.props.ratingValue,
            rating: null,
        }

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
        this.setState({rating});
        // Se tem este callback o chama passando o valor escolhido
        if(this.props.onSubmit) this.props.onSubmit(rating);
    }
    
    render(){
        let {readOnly, styleStar, style} = this.props;

        const {onRating, rating} = this.state;
        //
        let estrelas = rating || onRating;
        // Estilo
        styleStar = {...styleStar, cursor: (readOnly ? 'not-allowed': 'pointer') };

        // Determinação das funções
        const mouseOut = readOnly ? ()=> {} : this._onMouseOut.bind(this);
        const mouseOver = readOnly ? ()=>{} : this._onMouseOver.bind(this);
        const onClick = readOnly ? ()=>{} : this._onClick.bind(this);
        
        return (
        <span style={style} className='d-flex d-flex-column flex-ai-center'>
                <span style={styleStar}>
                    { [1,2,3,4,5].map(ele=>{
                        // Estilo das estrelas
                        const style = {...styleStar, color: (estrelas >= ele ? 'gold' : 'black')};
                        // Defina o titulo
                        const title = TEXTO_CLASSIFICACAO[estrelas];

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
Avaliador.defaultProps =  {
    ratingValue: 0,
    readOnly: false,
    styleStar: {},
    style: {},
};

Avaliador.propTypes = {
    /** 
    ** Uma função de callback que vai receber o valor escolhido das estrelas.
    */
    onSubmit: PropTypes.func,
    /** Um booleano que determina se o avaliador é somente leitura*/
    readOnly: PropTypes.bool,
    /** Um número (de 1 até 5) para determinar quantas estrelas foram marcadas */
    ratingValue: PropTypes.number,    
    /** Um objeto que determina o estilo para toda área do avaliador */
    style: PropTypes.object,
    /** Um objeto que determina o estio para a estrela */
    styleStar: PropTypes.object,
    /** Um booleano que determina se deve ter algo escrito abaixo da classificacao ou não */
    noLabel: PropTypes.bool,

};

export default Avaliador;