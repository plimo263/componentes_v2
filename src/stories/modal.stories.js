import React from 'react'
import Modal from '../components/modal';
import Logo from '../components/logo';


export default {
    title: 'Modal',
    component: Modal,
    parameters: {
        componentSubtitle: 'Um componente de Modal muito interessante para ser exibido na tela'
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

export const minimo = ()=> <Modal onFechar={()=>{}}></Modal>;
minimo.story = {
    ...objDescricao,
    parameters: { 
        docs: { storyDescription: ''} 
        } 
};

// Modal com o titulo registrando uma logo
export const comTitulo = ()=>{
    let cabe = <div className="bg-red"><Logo /></div>
    return <Modal onFechar={()=>{}} titulo={cabe}>COM A LOGO DA EMPRESA</Modal>
}
comTitulo.story = {
    ...objDescricao,
    parameters: { 
        docs: { storyDescription: 'Modal com um cabecalho personalizado'} 
        } 
};

// Modal que exibe a tela no tamanho full
export const modalFull = ()=>{
    let cabe = <div className="bg-red"><Logo /></div>
    return <Modal modalFull onFechar={()=>{}} titulo={cabe}>Este modal tem o tamanho full</Modal>
}
modalFull.story = {
    ...objDescricao,
    parameters: { 
        docs: { storyDescription: 'Este Modal com o tamanho para ocupar toda a tela'} 
        } 
};