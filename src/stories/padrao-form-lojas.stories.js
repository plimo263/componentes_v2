import React from 'react'
import PadraoFormLojas from '../components/padrao-form-lojas'
import {addParameters} from '@storybook/react';
import {INITIAL_VIEWPORTS} from '@storybook/addon-viewport'

export default {
    title: 'PadraoFormLojas',
    component: PadraoFormLojas,
    parameters: {
        componentSubtitle: 'Um formulário já pré-configurado com rotinas internas de verificação e post dos dados'
    }
}

addParameters({
    viewport: {
        viewports: INITIAL_VIEWPORTS,
    }
})

export const padrao = ()=> <PadraoFormLojas rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)}
    lojas={{ selecionadas: '1,2', total: [[1, "01"], [2, "02"]] }} 
/>;

//
export const lojas_mes_ano = ()=> <PadraoFormLojas rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)} tipo='lojas_mes_ano' 
    rotulos={{lojas: 'LOJAS', anoDe: 'ANO', ateOMes: 'MÊS'}}
    onChange={(valor,indice)=> console.log(valor, indice)} mes={3} anoDe="2020"
    lojas={{ selecionadas: '1,2', total: ["01", "02"] }} 
/>;

lojas_mes_ano.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulario obtem lojas, um campo com o mês e outro com o ano. Repassado a props onChange para ter um controle mais refinado sobre os campos quando os mesmos mudarem.'
        }
    }
}

// Formulario somente com datas de e ate
export const de_e_ate = ()=> <PadraoFormLojas rota='http://httpbin.org/post' 
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

//
export const padrao_sem_de_ate = ()=> <PadraoFormLojas rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)} tipo='padrao_sem_de_e_ate' 
    lojas={{ selecionadas: '1,2', total: ["01", "02"] }} 
    onChange={(valor,indice)=> console.log(valor, indice)}
/>;
padrao_sem_de_ate.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário que não tem as datas de e ate, somente as lojas.'
        }
    }
}

// Formulario que renderiza os ar_oc, fornecedores e grifes
export const tipos_grifes_fornecedores = ()=> <PadraoFormLojas rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)} tipo='tipos_grifes_fornecedores' 
    grifes={{selecionadas: 'AHIC', total: [['AHIC', 'AHIC'], ['RBAN', 'RBAN']]}}
    fornecedores={{selecionadas: 'LUXOTTICA', total: [['LUXOTTICA', 'LUXOTTICA'], ['G.O', 'G.O']]}}
    onChange={(valor,indice)=> console.log(valor, indice)}
/>;

tipos_grifes_fornecedores.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário contém os tipos (AR,OC,LG,LC), fornecedores e as grifes'
        }
    }
}

// Lojas com de e ate de emissao e de,ate de vencimento
export const lojas_de_ate_de_venc_ate_venc = ()=> <PadraoFormLojas rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)} tipo='lojas_de_ate_de_venc_ate_venc' 
    lojas={{ selecionadas: '1,2', total: ["01", "02"] }} de='2019-01-01' ate='2019-12-01' 
    de_venc='2020-01-01' ate_venc='2020-12-31' 
    onChange={(valor,indice)=> console.log(valor, indice)}
/>;

lojas_de_ate_de_venc_ate_venc.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário contém os Lojas e com os 4 campos DE EMISSAO, ATE EMISSAO DE VENC. ATE VENC.'
        }
    }
}

// Renderiza lojas e ano
export const lojas_ano = ()=> <PadraoFormLojas rota='http://httpbin.org/post' 
    fnPos={(resp, obj)=> console.log(resp.form)} tipo='lojas_ano' 
    lojas={{ selecionadas: '1,2', total: ["01", "02"] }} anoDe={2015}
    onChange={(valor,indice)=> console.log(valor, indice)}
/>;

lojas_ano.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário contém as lojas com o ano'
        }
    }
}

// Renderiza lojas tipos e grifes
export const lojas_tipos_grifes = ()=> <PadraoFormLojas rota='http://httpbin.org/post' 
fnPos={(resp, obj)=> console.log(resp.form)} tipo='lojas_tipos_grifes' 
lojas={{ selecionadas: '1,2', total: ["01", "02"] }} 
tipos={[['LC', 'LC']]}
onChange={(valor,indice)=> console.log(valor, indice)}
/>;

lojas_tipos_grifes.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário contém as lojas, os tipos e grifes'
        }
    }
}

// Renderiza lojas meses e anoDe e anoAte
export const lojas_meses_entre_anos = ()=> <PadraoFormLojas rota='http://httpbin.org/post' 
fnPos={(resp, obj)=> console.log(resp.form)} tipo='lojas_meses_entre_anos' 
lojas={{ selecionadas: '1,2', total: ["01", "02"] }} mes={3} anoDe={2015} anoAte={2016}
onChange={(valor,indice)=> console.log(valor, indice)}
/>;

lojas_meses_entre_anos.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário contém as lojas, o mes e os anos de e ate'
        }
    }
}

// Renderiza lojas e os tipos
export const lojas_tipos = ()=> <PadraoFormLojas rota='http://httpbin.org/post' 
fnPos={(resp, obj)=> console.log(resp.form)} tipo='lojas_tipos' 
lojas={{ selecionadas: '1,2', total: ["01", "02"] }} 
tipos={[['AR', 'AR'],['OC', 'OC'],['LC', 'LC'],['LG', 'LG']]}
onChange={(valor,indice)=> console.log(valor, indice)}
/>;

lojas_tipos.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário contém as lojas e os tipos de produtos'
        }
    }
}

// Renderiza lojas, de, ate e caixas
export const padrao_com_caixas = ()=> <PadraoFormLojas rota='http://httpbin.org/post' 
fnPos={(resp, obj)=> console.log(resp.form)} tipo='padrao_com_caixas' 
lojas={{ selecionadas: '1,2', total: ["01", "02"] }} de='2019-12-01' ate='2019-12-01' caixas=''
onChange={(valor,indice)=> console.log(valor, indice)}
/>;

padrao_com_caixas.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário contém as lojas e os tipos de produtos'
        }
    }
}

// Renderiza lojas, de, ate e montagem
export const padrao_com_montagem = ()=> <PadraoFormLojas rota='http://httpbin.org/post' 
fnPos={(resp, obj)=> console.log(resp.form)} tipo='padrao_com_montagem' 
lojas={{ selecionadas: '1,2', total: ["01", "02"] }} de='2019-12-01' ate='2019-12-01' montagem={{selecionadas: 'M', total: [["M", "MONTAGEM"], ["S", "SUFARCAGEM"]]}}
onChange={(valor,indice)=> console.log(valor, indice)}
/>;

padrao_com_montagem.story = {
    parameters: {
        docs: {
            storyDescription: 'Formulário contém as lojas, de, ate e montagem'
        }
    }
}