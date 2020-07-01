import React from 'react'
import Botao from '../components/botao'
import Carregar from '../components/carregar'

import { action } from '@storybook/addon-actions'

export default {
    component: Botao,
    title: 'Botao',
    parameters: {
        componentSubtitle: 'UM LINDO COMPONENTE DE BOTÃO INTERATIVO'
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
// Botao simples
export const texto = ()=> <Botao>Enviar</Botao>;
// Com onClick
export const comClique = ()=> <Botao onClick={action('clicado')}>SALVAR</Botao>;

objDescricao.parameters.docs.storyDescription = 'EXEMPLO DE UM BOTÃO QUE RECEBEU A PROPS onClick';
comClique.story = objDescricao;

// Com titulo
export const comTitulo = ()=> <Botao title='SALVA O ARGUMENTO'>SALVAR</Botao>;
opt = JSON.parse(JSON.stringify(objDescricao));
opt.parameters.docs.storyDescription = 'RECEBEU A PROPS title. DEIXAR O MOUSE SOBRE O BOTÃO REVELA O "SALVA O ARGUMENTO".';
comTitulo.story = opt

// Com classe
export const comClasse = ()=> <Botao className='bg-red text-white'>CONFIRMAR</Botao>;
opt = JSON.parse(JSON.stringify(objDescricao));
opt.parameters.docs.storyDescription = 'RECEBEU A PROPS className PARA MUDANÇA DE COR DO BOTÃO';
comClasse.story = opt;

// desabilitado
export const Desabilitado = ()=> <Botao disabled>AGUARDE...</Botao>;
opt = JSON.parse(JSON.stringify(objDescricao));
opt.parameters.docs.storyDescription = 'RECEBEU A PROPS disabled PARA QUE O BOTÃO NÃO POSSA SER CLICADO';
Desabilitado.story = opt;

// style
export const comStyle = ()=> <Botao style={{fontSize:'2.55rem'}}>GRAVADO!!</Botao>;
opt = JSON.parse(JSON.stringify(objDescricao));
opt.parameters.docs.storyDescription = 'RECEBEU A PROPS style DEFININDO UMA FONTE MAIOR';
comStyle.story = opt;
// com componentes dentro
export const comOutrosComponentes = ()=><Botao><Carregar mensagem='CARREGANDO' /></Botao>;
opt = JSON.parse(JSON.stringify(objDescricao));
opt.parameters.docs.storyDescription = 'BOTÃO COM O COMPONENTE Carregar';
comOutrosComponentes.story = opt;