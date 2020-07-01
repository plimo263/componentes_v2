import React from 'react'
import Fade from '../components/fade';
import Botao from '../components/botao';


export default {
    title: 'Fade',
    component: Fade,
}

export const padrao = ()=> <Fade><span>OLA</span></Fade>;
//
export const comBotao = ()=> <Fade><Botao>OLA</Botao></Fade>;
