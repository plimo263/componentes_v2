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

export const minimo = ()=> <Modal onFechar={()=>{}}></Modal>;

// Modal com o titulo registrando uma logo
export const comTitulo = ()=>{
    let cabe = <div className="bg-red"><Logo /></div>
    return <Modal titulo={cabe}>COM A LOGO DA EMPRESA</Modal>
}
