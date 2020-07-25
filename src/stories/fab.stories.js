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