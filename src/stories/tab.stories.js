import React from 'react'
import Tab from '../components/tab'
import Carregar from '../components/carregar'

import { action } from '@storybook/addon-actions'

export default {
    component: Tab,
    title: 'Tab',
    parameters: {
        componentSubtitle: 'Conteúdo por abas.'
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

// Tab simples
export const padrao = ()=> (
    <Tab cabe={['PRODUTOS', 'CLIENTES']} 
        corpo={[
            <div>
                <p>LISTA DE PRODUTOS</p>
            </div>,
            <div>
                <p>LISTA DE CLIENTES</p>
            </div>
        ]}
/>)
padrao.story = {
    ...objDescricao,
    "parameters": {
         "docs": {
             "storyDescription": 'TAB MAIS BÁSICA POSSÍVEL, COM CABECALHO E CORPO'
        }
    }
}
// Tab com modelo mobile
export const modoMobile = ()=> (
    <Tab modo='mobile' cabe={['PRODUTOS', 'CLIENTES']} 
        corpo={[
            <div>
                <p>LISTA DE PRODUTOS</p>
            </div>,
            <div>
                <p>LISTA DE CLIENTES</p>
            </div>
        ]}
/>)
modoMobile.story = {
    ...objDescricao,
    "parameters": {
         "docs": {
             "storyDescription": 'Exibe o Tab com um risco abaixo das abas selecionadas'
        }
    }
}
// Usando cracha
export const comCracha = ()=> (
    <Tab cabe={['PRODUTOS', 'CLIENTES']} 
        modo='mobile'
        cracha={[3,5]}
        crachaTitulo={['3 PRODUTOS NOVOS', '5 PRODUTOS NOVOS']}
        corpo={[
            <div>
                <p>LISTA DE PRODUTOS</p>
            </div>,
            <div>
                <p>LISTA DE CLIENTES</p>
            </div>
        ]}
/>)
comCracha.story = {
    ...objDescricao,
    "parameters": {
         "docs": {
             "storyDescription": 'Exibe crachas, são marcações acima de cada aba para dar alguma dica ao usuário'
        }
    }
}

// Modo slide da visualização tab
export const modoSlide = ()=> (
    <div>
        <br/><br/>
        <Tab modo='slide' cabe={['PRODUTOS', 'CLIENTES']} 
            corpo={[
                <div>
                    <p>LISTA DE PRODUTOS</p>
                </div>,
                <div>
                    <p>LISTA DE CLIENTES</p>
                </div>
            ]}
        />
    </div>
)
modoSlide.story = {
    ...objDescricao,
    "parameters": {
         "docs": {
             "storyDescription": 'Exibe o Tab botões flutuantes nas extremidades e barra destacada das abas.'
        }
    }
}