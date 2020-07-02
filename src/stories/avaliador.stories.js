import React from 'react'
import Avaliador from '../components/avaliador'

export default {
    component: Avaliador,
    title: 'Avaliador',
    parameters: {
        componentSubtitle: 'Este componente permite exibir uma avaliação de 5 estrelas em que se é possível manipular seu estado'
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
export const padrao = ()=> <Avaliador ratingValue={3} onSubmit={(valor)=> console.log(valor)} /> ;

objDescricao.parameters.docs.storyDescription = 'Avaliador com valor 3';
padrao.story = objDescricao;

// Avaliador com somenteLeitura
export const somenteLeitura = ()=> <Avaliador readOnly ratingValue={2} onSubmit={()=>{}} />;

opt = Object.assign({}, objDescricao, {parameters: {docs: { storyDescription: 'Avaliador modo somente leitura'} } });
somenteLeitura.story = opt;

// Avaliador com estilo
export const comEstilo = ()=> <Avaliador style={{color: 'firebrick'}} styleStar={{fontWeight: 'bold'}} ratingValue={2} onSubmit={()=>{}} />;

opt = Object.assign({}, objDescricao, {parameters: {docs: { storyDescription: 'Avaliador com objeto style e styleStar enviado'} } });
comEstilo.story = opt;