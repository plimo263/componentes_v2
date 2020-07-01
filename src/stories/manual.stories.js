import React from 'react'
import Manual from '../components/manual'

export default {
    component: Manual,
    title: 'Manual',
    parameters: {
        componentSubtitle: 'Um componente que um link e um titulo e retorna um local para acesso ao manual'
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
export const padrao = ()=> <Manual titulo='MANUAL' link='/vendas_por_loja' /> ;

objDescricao.parameters.docs.storyDescription = 'MANUAL COM O link E O titulo ENVIADO';
padrao.story = objDescricao;
