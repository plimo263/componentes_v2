import React from 'react'
import Classificar from '../components/classificar'

import { action } from '@storybook/addon-actions'

export default {
    component: Classificar,
    title: 'Classificar',
    parameters: {
        componentSubtitle: 'Este componente permite gerir uma classificação por escolha de estrela e introduz um formulário que pode ser utilizado como feedback para o que esta sendo classificado.'
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
export const padrao = ()=> <Classificar ratingValue={3} onSubmit={(valor)=> console.log(valor)} /> ;

objDescricao.parameters.docs.storyDescription = 'Classificador padrão com 3 estrelas ativas';
padrao.story = objDescricao;

// Classificado com envio de mensagem de erro
export const classificadoComErro = ()=> <Classificar ratingValue={2} onSubmit={()=>{}} erro='CLASSIFICAÇÃO INDISPONIVEL' />;

opt = Object.assign({}, objDescricao, {parameters: {docs: { storyDescription: 'Classificador com mensagem de erro'} } });
classificadoComErro.story = opt;

// Classificado com botão no aguardo
export const classificadoComAguardar = ()=> <Classificar onSubmit={()=>{}} aguardar={true} />;
classificadoComAguardar.story = Object.assign({}, objDescricao, { parameters: {docs:{storyDescription: 'Classificador com status e aguardar'} } });
