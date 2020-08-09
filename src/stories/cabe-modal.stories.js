import React from 'react'
import CabeModal from '../components/cabe-modal'
import Modal from '../components/modal';

export default {
    component: CabeModal,
    title: 'CabeModal',
    parameters: {
        componentSubtitle: 'Este componente exibe um cabecalho já formatado com a logo da empresa para o modal'
    }
}
// OBJ STORY
let objDescricao =  {
    parameters: {
        docs: {
            storyDescription: ''
        }
    }
};
let opt;
// Manual simples
export const padrao = ()=> (
    <Modal titulo={<><CabeModal /></>} onFechar={()=>{}}>
        <>CORPO SIMPLES</>
    </Modal>
);

objDescricao.parameters.docs.storyDescription = 'Cabe Modal sendo aplicado a um modal sem parametros';
padrao.story = objDescricao;
