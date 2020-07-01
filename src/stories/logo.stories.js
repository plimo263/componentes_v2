import React from 'react'
import Logo from '../components/logo'

export default {
    title: 'Logo',
    component: Logo,
    parameters: {
        componentSubtitle: 'Um componente que representa a logo do sistema. Para uma melhor visualização um fundo vermelho foi incluso',
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

export const padrao = ()=> (
<div className='pad-5 bg-red'>
    <Logo />
</div>
)
// Com classe
export const comClasse = ()=>(
    <Logo className='bg-red pad-5 bor-rad-10' />
)
opt = JSON.parse(JSON.stringify(objDescricao));
opt.parameters.docs.storyDescription = 'LOGO COM A PROPS className para dar um visual mais bonito';
comClasse.story = opt;

// Sendo um link para levar a outro destino
export const comLink = ()=>(
    <div className='pad-5 bg-red'>
        <Logo href='https://www.google.com.br' />
    </div>
)
opt = JSON.parse(JSON.stringify(objDescricao));
opt.parameters.docs.storyDescription = 'LOGO COM A PROPS href para redirecionar a outra área';
comLink.story = opt;
