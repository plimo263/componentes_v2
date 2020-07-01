import React from 'react'
import Carregar from '../components/carregar';

export default {
    title: 'Carregar',
    component: Carregar,
    parameters: {
        componentSubtitle: 'Um componente que representa um carregamento'
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

export const Padrao = ()=> <Carregar />
// Com classe
export const comClasse = ()=> <Carregar className='text-danger' />
opt = JSON.parse(JSON.stringify(objDescricao));
opt.parameters.docs.storyDescription = 'USADO COM A PROPS className para estilizar o carregamento.';
comClasse.story = opt;

// Com estilo
export const comStyle = ()=> <Carregar style={{fontSize: '2.5rem'}} />
opt = JSON.parse(JSON.stringify(objDescricao));
opt.parameters.docs.storyDescription = 'USADO COM A PROPS style para estilizar o carregamento.';
comStyle.story = opt;

// Com a mensagem
export const comMensagem = ()=> <Carregar mensagem='QUASE PRONTO' />
opt = JSON.parse(JSON.stringify(objDescricao));
opt.parameters.docs.storyDescription = 'USADO COM A PROPS mensagem para informar algo.';
comMensagem.story = opt;
