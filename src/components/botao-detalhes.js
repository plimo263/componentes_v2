import React, {useState} from 'react';
import { PropTypes  } from "prop-types";
// Importando componentes do framer-motion
import {motion, AnimateSharedLayout, AnimatePresence} from 'framer-motion';
import {setModal} from '../redux/actions/';
import {connect} from 'react-redux';

/**
ESTE COMPONENTE EXIBE UM BOTÃO NA ÁREA INFERIOR, ONDE SE CLICA SOBRE ELE E EXIBE AS OPÇÕES POR PADRÃO. 
- COMENTARIO OU SUGESTÃO
- MANUAL DO RELATORIO.


 */
const variants = {
    hidden: {
        x: '-100vw',
    },
    visible: {
        x: '15px',
        transition: {
            type: 'spring',
            delay: 1,
            duration: .8,
            stiffness: 100
        }
    },
    exit: {
        x: '-100vw',
        transition: {
            type: 'spring',
            duration: .8,

        }
    }
}

// const variants = {
//     hidden: {
//        y: '-120vh',
//        x: '50vw',
//        scale: 2.5,

//     },
//     visible: {
//        y: '15px',
//        x: '10px',
//        scale: 1,
//        transition: {
//            y: {delay: 3, type: 'spring', mass: 1, stiffness: 20,  duration: 1},
//            scale: {delay: 4, type: 'spring', duration: .5},
//            x: {delay: 4.6, type: 'spring', stiffness: 20, duration: 2.5 },
        
//        }

//     },
//     whileHover: {
//         scale: 1.2,
//         y: '-10px',
//         transition: {
//             type: 'spring',
//             duration: .5,
//             y: { yoyo: 6, duration: .3}
//         }
//     },
//     exit: {
//         x: '-100vw'
//     },
// }

const variantsFilho = {
    hidden: {
        scale: .2,
    },
    visible: {
        scale: 1,
        transition: {
           scale: {type: 'spring',  duration: .5}
        }
    },
    exit: {
        
        scale: 0,
        transition: {
           scale: {type: 'spring', duration: .5}
        }
    }
}

// Lista de acessos e links
const links = {
    '/pendencia_entregue': 'https://www.evernote.com/shard/s386/sh/a683ff1e-2dd0-eec0-6865-a6c9bbaf98eb/e61f2b7b0dacb2d3144182edcc676e04',
    '/tabela_de_lentes': 'https://www.evernote.com/shard/s386/sh/5a8017d8-d7f4-40ff-8218-30af905d7164/88c88b0409c33d03ac60ab9392503a16',
};    


class BotaoDetalhes extends React.Component {


    
    render(){
        const {lista, aguardar} = this.props;
        //
        const rota = window.location.pathname;

        let lt = [
            {onClick:()=> {
                this.props.setModal({
                    tipo: 'TIPO_MODAL_PARA_SUGESTAO',
                    rota,
                })

            }, icon: 'message', title: "DÊ SEU COMENTÁRIO para melhoria", bgColor: '#228b22', txColor: '#000000'},
            { onClick: ()=>{
                // Se a rota tem no manual vamos abrir ela, senão exibe mensagem 
                if(links.hasOwnProperty(rota)){ 
                    window.open(links[rota], '_blank');
                } else {
                    window.alert('AINDA NÃO TEMOS UM MANUAL PARA ESTE RELATÓRIO');
                };

            }, icon: 'help_outline', title: "MANUAL DE AJUDA SOBRE ESTE RELATÓRIO", bgColor: '#D4AF37', txColor: '#000000'},
        ]
        //
        if(lista) lt = [...lt, ...lista];

        return (
            <AnimateSharedLayout>
                <motion.div layout 
                    style={{position: 'fixed', bottom: '15px'}}
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                >
                    {[0].map(ele=> <Item aguardar={aguardar} key={ele} lista={lt} /> )}                
                </motion.div>
            </AnimateSharedLayout>
        )
    }


}


const Item = ({lista, aguardar})=>{
    const [ver, setVer] = useState(false);
    // Se estiver ativo define uma animacao, senao define outra

    const varianteBotao = {
        padrao: { transform: 'rotate(0deg)', transition: {duration: .3} },
        rotacionado: {transform: 'rotate(135deg)',  transition: {duration: .3} }
        };

    return (
        <motion.div layout onClick={()=>{
                if(aguardar) return false;
                setVer(prevValue=> !prevValue);
        }}>
            <AnimatePresence>{ver && (
                lista.map(((ele,ix)=> <Conteudo key={ix} {...ele} />))
            )}</AnimatePresence>
            <motion.i title={aguardar ? "ESPERE UM MOMENTO" : "CLIQUE PARA MAIS DETALHES" }
                
                variants={varianteBotao}
                initial='rotacionado'
                animate={ver ? 'padrao' : 'rotacionado'}
                exit='padrao'
                style={aguardar ? {opacity: '.5'} : {}}
                className={`${aguardar && 'rotacionar-infinito'} icone-redondo bg-red text-white text-bold material-icons pad-10`}>{aguardar ? 'sync' : 'close'}</motion.i>
        </motion.div>
    )
}

const Conteudo = ({icon, onClick, title, bgColor, txColor})=>{
    return (
    <motion.div key="cont"
        title={title}
        variants={variantsFilho}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClick}
        className="text-center"
    >
            <motion.i style={{backgroundColor: bgColor, color: txColor}}
                className='icone-redondo material-icons pad-5'>{icon}</motion.i>
    </motion.div>
    )
}

const mapDispatchToProps = {
    setModal
}

BotaoDetalhes.propTypes = {
    /** Um boleano que determina se o botão principal deve ficar em aguardo ou não */
    aguardar: PropTypes.bool,
    /** Um array que registre cada objeto com todas as opções que podem ser usadas pelo sistema.  */
    lista: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.string,
        onClick: PropTypes.func,
        title: PropTypes.string,
        bgColor: PropTypes.string,
        txColor: PropTypes.string,
    })) 
}

export default connect(null, mapDispatchToProps)(BotaoDetalhes);