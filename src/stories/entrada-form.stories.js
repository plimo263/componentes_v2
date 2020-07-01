import React from 'react'
import EntradaForm from '../components/entrada-form'
import {addParameters} from '@storybook/react';
import {INITIAL_VIEWPORTS} from '@storybook/addon-viewport'

export default {
    title: 'EntradaForm',
    component: EntradaForm,
    parameters: {
        componentSubtitle: 'Um formulário que pode ser criado dinamicamente. Usado para entrada de dados. É Obrigatório a props onSubmit',
    }
}

addParameters({
    viewport: {
        viewports: INITIAL_VIEWPORTS,
    }
})

// OBJ STORY
let objDescricao =  {
    parameters: {
        docs: {
            storyDescription: ''
        }
    }
};

export const padrao = ()=> <EntradaForm schema={
    [
        {type: 'text', label: 'NOME', icon: 'person', placeholder: 'DIGITE SEU NOME'}
    ]
} onSubmit={(e)=> {e.preventDefault()}} />

let opt = JSON.parse(JSON.stringify(objDescricao));
opt.parameters.docs.storyDescription = 'EntradaForm com o básico para funcionar';
padrao.story = opt;

export const aguardar = ()=> <EntradaForm aguardar={true} schema={
    [
        {type: 'text', defaultValue: 'MARCOS', label: 'NOME', icon: 'person', placeholder: 'DIGITE SEU NOME'},
        {type: 'password', defaultValue: '123', label: 'SENHA', icon: 'vpn_key', placeholder: 'DIGITE A SUA SENHA'}
    ]
} onSubmit={(e)=> {e.preventDefault()}} />

opt = JSON.parse(JSON.stringify(objDescricao));
opt.parameters.docs.storyDescription = 'Esta entrada esta no processo de aguardar, o botão de envio e os campo ficam sem opção para edição.';

aguardar.story = opt;

export const botaoDeEnvioVermelho = ()=> <EntradaForm classNameBotao='bg-red text-white' schema={
    [
        {type: 'text', defaultValue: 'MARCOS', label: 'NOME', icon: 'person', placeholder: 'DIGITE SEU NOME'},
        {type: 'password', defaultValue: '123', label: 'SENHA', icon: 'vpn_key', placeholder: 'DIGITE A SUA SENHA'}
    ]
} onSubmit={(e)=> {e.preventDefault()}} />

opt = JSON.parse(JSON.stringify(objDescricao));
opt.parameters.docs.storyDescription = 'Botão de envio recebe uma classe css, neste caso a classe coloca uma leve cor vermelha no botão de envio.';

botaoDeEnvioVermelho.story = opt;

export const comMensagemDeErro = ()=> <EntradaForm erro='FAVOR PREENCHER O NOME' schema={
    [
        {type: 'text', label: 'NOME', icon: 'person', placeholder: 'DIGITE SEU NOME'},
        {type: 'password', defaultValue: '123', label: 'SENHA', icon: 'vpn_key', placeholder: 'DIGITE A SUA SENHA'}
    ]
} onSubmit={(e)=> {e.preventDefault()}} />

opt = JSON.parse(JSON.stringify(objDescricao));
opt.parameters.docs.storyDescription = 'Uma mensagem de erro foi repassada para demonstrar que existe algum problema.';

comMensagemDeErro.story = opt;

export const semBotaoDeEnvio = ()=> <EntradaForm somenteLeitura schema={
    [
        {type: 'text', defaultValue: 'MARCOS', label: 'NOME', icon: 'person', placeholder: 'DIGITE SEU NOME'},
        {type: 'password', defaultValue: '123', label: 'SENHA', icon: 'vpn_key', placeholder: 'DIGITE A SUA SENHA'}
    ]
} onSubmit={(e)=> {e.preventDefault()}} />

opt = JSON.parse(JSON.stringify(objDescricao));
opt.parameters.docs.storyDescription = 'Formulário é somente para leitura, com isto os campos ficam desativados e o botão de envio não é exibido.';

semBotaoDeEnvio.story = opt;

export const formularioMobile = ()=> <EntradaForm modo='mobile' schema={
    [
        {type: 'text', defaultValue: 'MARCOS', label: 'NOME', icon: 'person', placeholder: 'DIGITE SEU NOME'},
        {type: 'password', defaultValue: '123', label: 'SENHA', icon: 'vpn_key', placeholder: 'DIGITE A SUA SENHA'}
    ]
} onSubmit={(e)=> {e.preventDefault()}} />

opt = JSON.parse(JSON.stringify(objDescricao));
opt.parameters.docs.storyDescription = 'Formulário que insere todos os campos na vertical usando o modelo flex (display: flex-column).';

formularioMobile.story = opt;

