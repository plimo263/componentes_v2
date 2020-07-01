import React from 'react'
import PadraoForm from '../components/padrao-form'
import {addParameters} from '@storybook/react';
import {INITIAL_VIEWPORTS} from '@storybook/addon-viewport'

export default {
    title: 'PadraoForm',
    component: PadraoForm,
    parameters: {
        componentSubtitle: 'Um formulário já pré-configurado com rotinas internas de verificação e post dos dados'
    }
}

addParameters({
    viewport: {
        viewports: INITIAL_VIEWPORTS,
    }
})

export const padrao = ()=> <PadraoForm rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp)}
    grupos={{ selecionadas: '1,2,3', total: [[1, "FMOREIRA"], [2, "FB"], [3, "AJOCE"]]}} 
    lojas={{ selecionadas: '1,2', total: [[1, "01"], [2, "02"]] }} 
/>;


export const  grupos_lojas = ()=> <PadraoForm rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)} tipo='grupos_lojas' 
    grupos={{ selecionadas: '1,2,3', total: [[1, "FMOREIRA"], [2, "FB"], [3, "AJOCE"]]}} 
    lojas={{ selecionadas: '1,2', total: ["01", "02"] }} 
/>;

grupos_lojas.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário montado para o modelo de GRUPOS com LOJAS. A props tipo = "grupos_lojas" foi repassada e com isto a exibição se forma somente por lojas fazendo uma concatenação entre grupos e lojas (EXCLUSIVIDADE BH).'
        }
    }
}

export const grupos_lojas_ate_mes_ano = ()=> <PadraoForm rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)} tipo='grupos_lojas_ate_mes_ano' 
    onChange={(valor,indice)=> console.log(valor, indice)} mes={3} anoDe="2020"
    grupos={{ selecionadas: '1,2,3', total: [[1, "FMOREIRA"], [2, "FB"], [3, "AJOCE"]]}} 
    lojas={{ selecionadas: '1,2', total: ["01", "02"] }} 
/>;

grupos_lojas_ate_mes_ano.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulario obtem grupos/lojas, um campo com o mês e outro com o ano. Repassado a props onChange para ter um controle mais refinado sobre os campos quando os mesmos mudarem.'
        }
    }
}
// Renderiza o formulario para o grupos_lojas_meses_entre_anos
export const grupos_lojas_meses_entre_anos = ()=> <PadraoForm rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)} tipo='grupos_lojas_meses_entre_anos' 
    onChange={(valor,indice)=> console.log(valor, indice)} mes={3} anoDe="2018" anoAte="2020"
    grupos={{ selecionadas: '1,2,3', total: [[1, "FMOREIRA"], [2, "FB"], [3, "AJOCE"]]}} 
    lojas={{ selecionadas: '1,2', total: ["01", "02"] }} 
/>;

grupos_lojas_meses_entre_anos.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário para obter o filtro grupos/lojas contendo o campo de meses e os anos.'
        }
    }
}

// Formulario somente com datas de e ate
export const de_e_ate = ()=> <PadraoForm rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)} tipo='de_e_ate' 
    onChange={(valor,indice)=> console.log(valor, indice)} de='2020-03-01' ate='2020-03-10'
/>;

de_e_ate.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário que tem somente datas de e ate.'
        }
    }
}
// Formulario com somente os grupos sem lojas, de e ate
export const grupos_ar_oc = ()=> <PadraoForm rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)} tipo='grupos_ar_oc' 
    grupos={{ selecionadas: '1,2,3', total: [[1, "FMOREIRA"], [2, "FB"], [3, "AJOCE"]]}} 
    onChange={(valor,indice)=> console.log(valor, indice)}
/>;

grupos_ar_oc.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário que tem somente os grupos e os tipos AR,OC.'
        }
    }
}

export const padrao_sem_de_ate = ()=> <PadraoForm rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)} tipo='padrao_sem_de_ate' 
    lojas={{ selecionadas: '1,2', total: ["01", "02"] }} 
    grupos={{ selecionadas: '1,2,3', total: [[1, "FMOREIRA"], [2, "FB"], [3, "AJOCE"]]}} 
    onChange={(valor,indice)=> console.log(valor, indice)}
/>;

padrao_sem_de_ate.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário contém somente os grupos e lojas.'
        }
    }
}
// Formulario que renderiza os grupos e grifes de ar e oc
export const grupos_grifes_ar_oc = ()=> <PadraoForm rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)} tipo='grupos_grifes_ar_oc' 
    grifes={{selecionadas: 'AHIC', total: [['AHIC', 'AHIC'], ['RBAN', 'RBAN']]}}
    grupos={{ selecionadas: '1,2,3', total: [[1, "FMOREIRA"], [2, "FB"], [3, "AJOCE"]]}} 
    onChange={(valor,indice)=> console.log(valor, indice)}
/>;

grupos_grifes_ar_oc.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário contém os grupos com as grifes e os tipos AR/OC'
        }
    }
}

// Formulario que renderiza os ar_oc, fornecedores e grifes
export const ar_oc_fornecedores_grifes = ()=> <PadraoForm rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)} tipo='ar_oc_fornecedores_grifes' 
    grifes={{selecionadas: 'AHIC', total: [['AHIC', 'AHIC'], ['RBAN', 'RBAN']]}}
    fornecedores={{selecionadas: 'LUXOTTICA', total: [['LUXOTTICA', 'LUXOTTICA'], ['G.O', 'G.O']]}}
    onChange={(valor,indice)=> console.log(valor, indice)}
/>;

ar_oc_fornecedores_grifes.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário contém os tipos ar_oc, fornecedores e as grifes'
        }
    }
}
// GruposLojas e anoDe
export const grupos_lojas_ano = ()=> <PadraoForm rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)} tipo='grupos_lojas_ano' 
    lojas={{ selecionadas: '1,2', total: ["01", "02"] }} anoDe={2015}
    grupos={{ selecionadas: '1,2,3', total: [[1, "FMOREIRA"], [2, "FB"], [3, "AJOCE"]]}} 
    onChange={(valor,indice)=> console.log(valor, indice)}
/>;

grupos_lojas_ano.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário contém os gruposLojas com o ano'
        }
    }
}

// GruposLojas com de e ate de emissao e de,ate de vencimento
// GruposLojas e anoDe
export const grupos_lojas_de_ate_de_venc_ate_venc = ()=> <PadraoForm rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)} tipo='grupos_lojas_de_ate_de_venc_ate_venc' 
    lojas={{ selecionadas: '1,2', total: ["01", "02"] }} de='2019-01-01' ate='2019-12-01' 
    de_venc='2020-01-01' ate_venc='2020-12-31' 
    grupos={{ selecionadas: '1,2,3', total: [[1, "FMOREIRA"], [2, "FB"], [3, "AJOCE"]]}} 
    onChange={(valor,indice)=> console.log(valor, indice)}
/>;

grupos_lojas_de_ate_de_venc_ate_venc.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário contém os gruposLojas com os 4 campos DE EMISSAO, ATE EMISSAO DE VENC. ATE VENC.'
        }
    }
}

export const padrao_grifes_tipos = ()=> <PadraoForm rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)} tipo='padrao_grifes_tipos' 
    lojas={{ selecionadas: '1,2', total: ["01", "02"] }} grifes={{selecionadas:'AHIC', total: [['AHIC', 'AHIC']]}}
    tipos={[ ['AR', 'AR'], ['OC', 'OC'] ]}
    grupos={{ selecionadas: '1,2,3', total: [[1, "FMOREIRA"], [2, "FB"], [3, "AJOCE"]]}} 
    onChange={(valor,indice)=> console.log(valor, indice)}
/>;

padrao_grifes_tipos.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário contém grupos, lojas as grifes com os tipos.'
        }
    }
}

export const padrao_tipos = ()=> <PadraoForm rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)} tipo='padrao_tipos' 
    lojas={{ selecionadas: '1,2', total: ["01", "02"] }} 
    tipos={[ ['AR', 'AR'], ['OC', 'OC'] ]}
    grupos={{ selecionadas: '1,2,3', total: [[1, "FMOREIRA"], [2, "FB"], [3, "AJOCE"]]}} 
    onChange={(valor,indice)=> console.log(valor, indice)}
/>;

padrao_tipos.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário contém grupos, lojas e os tipos.'
        }
    }
}