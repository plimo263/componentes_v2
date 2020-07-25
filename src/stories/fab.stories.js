import React from 'react'
import Fab from '../components/fab'
import Carregar from '../components/carregar'

import { action } from '@storybook/addon-actions'

export default {
    component: Fab,
    title: 'Fab',
    parameters: {
        componentSubtitle: 'Botão flutuante de ação.'
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

// Fab simples
export const padrao = ()=> (
    <Fab onClick={()=> alert('oi')} />
)
padrao.story = {
    ...objDescricao,
    "parameters": {
         "docs": {
             "storyDescription": 'Float Action Bar padrão'
        }
    }
}
//
export const outroIcone = ()=>(
    <Fab icon="edit" onClick={()=> alert('oi')} />
)
outroIcone.story = {
    ...objDescricao,
    "parameters": {
         "docs": {
             "storyDescription": 'Fab com icone de edição'
        }
    }
}
//
export const desativado = ()=>(
    <Fab icon="edit" disabled onClick={()=> alert('oi')} />
)
desativado.story = {
    ...objDescricao,
    "parameters": {
         "docs": {
             "storyDescription": 'Fab com botão  desativado'
        }
    }
}
//
export const rotacionar = ()=>(
    <Fab icon="sync" disabled title="AGUARDE, CARREGANDO" rotate onClick={()=> alert('oi')} />
)
rotacionar.story = {
    ...objDescricao,
    "parameters": {
         "docs": {
             "storyDescription": 'Fab em estado de rotação, como se estivesse aguardando algo'
        }
    }
}