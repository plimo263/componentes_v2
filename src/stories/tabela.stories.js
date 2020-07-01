import React from 'react'
import Tabela from '../components/tabela'

export default {
    title: 'Tabela',
    component: Tabela,
    parameters: {
        componentSubtitle: ''
    }
}


let cabe = ["EMPRESA", "LOJA", "DINHEIRO", "CARTAO DEBITO", "CARTAO CREDITO", 
"VENDAS", "DESCONTO MEDIO"];
let corpo = [
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433]
];

export const padrao = ()=>{ 
let cabe = ["EMPRESA", "LOJA", "DINHEIRO", "CARTAO DEBITO", "CARTAO CREDITO", 
"VENDAS", "DESCONTO MEDIO"];
let corpo = [
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433]
];
return <Tabela cabe={cabe} corpo={corpo} />;
}

//
export const monetario = ()=>{ 
let cabe = ["EMPRESA", "LOJA", "DINHEIRO", "CARTAO DEBITO", "CARTAO CREDITO", 
"VENDAS", "DESCONTO MEDIO"];
let corpo = [
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433]
];
return <Tabela cabe={cabe} corpo={corpo} monetario={[2,3,4]} />
}
monetario.story = {
    parameters: {
        docs: {
           storyDescription :'Tabela com os os campos monetários convertidos (campos indices 2,3,4).'
        }
    }
};

export const percentual = ()=> {
let cabe = ["EMPRESA", "LOJA", "DINHEIRO", "CARTAO DEBITO", "CARTAO CREDITO", 
"VENDAS", "DESCONTO MEDIO"];
let corpo = [
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433]
];
return <Tabela cabe={cabe} corpo={corpo} percentual={[6]} />;
}
percentual.story = {
    parameters: {
        docs: {
           storyDescription :'Tabela com os campos percentuais convertidos (campo indice 6).'
        }
    }
};

export const classeCabeRodape = ()=>{ 
let cabe = ["EMPRESA", "LOJA", "DINHEIRO", "CARTAO DEBITO", "CARTAO CREDITO", 
"VENDAS", "DESCONTO MEDIO"];
let corpo = [
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433]
];
return <Tabela cabe={cabe} corpo={corpo} calculaRodape classNameCabe='success' classNameRodape='success' />;
}
classeCabeRodape.story = {
    parameters: {
        docs: {
           storyDescription :'Tabela com classes CSS aplicadas ao cabecalho e rodape.'
        }
    }
};

export const pesquisando = ()=>{
let cabe = ["EMPRESA", "LOJA", "DINHEIRO", "CARTAO DEBITO", "CARTAO CREDITO", 
"VENDAS", "DESCONTO MEDIO"];
let corpo = [
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433]
]; 
return <Tabela cabe={cabe} corpo={corpo} pesquisando />;
}
pesquisando.story = {
    parameters: {
        docs: {
            storyDescription: 'Tabela com props pesquisando ativado, como se aguardasse algo terminar de acontecer (devido limitações do storybook você precisa clicar sobre o cabecalho para ver o carregando...). '
        }
    }
}

/*

*/

export const dinamico = ()=>{
    let cabe = ['Empresa', 'LOJA', 'NOME', 'CV', 'DINHEIRO', 'C. DEBITO', 'C. CREDITO', 
'CHEQUE', 'CONVENIO', 'FINAN', 'Valor Pagamento', 'Data Pagamento'];
    let corpo = [
    {'id': 5, 'dinamico': [
            ['GMARQUES', '0901', 'RENATA ROSAN', '0198750-0901', 0.0, 0.0, 745.0, 0.0, 0.0, 0.0, 745.0, '20191010'], 
            ['GMARQUES', '0901', 'RENATA ROSAN', '0198970-0901', 500.0, 0.0, 0.0, 0.0, 0.0, 0.0, 500.0, '20191004'], 
            ['GMARQUES', '0901', 'RENATA ROSAN', '0200461-0901', 0.0, 0.0, 415.0, 0.0, 0.0, 0.0, 415.0, '20191010']
        ], 'data': ['GMARQUES', '0901', 'RENATA ROSAN', '--', 500.0, 0.0, 1160.0, 0.0, 0.0, 0.0, 1660.0, '--']
    }, 
    {'id': 4, 'dinamico': [
            ['GMARQUES', '0901', 'EUZABIA BATI', '0196683-0901', 0.0, 119.0, 0.0, 0.0, 0.0, 0.0, 119.0, '20191005']
        ], 'data': ['GMARQUES', '0901', 'EUZABIA BATI', '--', 0.0, 119.0, 0.0, 0.0, 0.0, 0.0, 119.0, '--']}, 
    {'id': 1, 'dinamico': [
            ['GMARQUES', '0901', 'JHONY CESAR ', '0187730-0901', 0.0, 0.0, 500.0, 0.0, 0.0, 0.0, 500.0, '20191001'], 
            ['GMARQUES', '0901', 'JHONY CESAR ', '0194080-0901', 0.0, 0.0, 330.0, 0.0, 0.0, 0.0, 330.0, '20191003'], 
            ['GMARQUES', '0901', 'JHONY CESAR ', '0195677-0901', 0.0, 300.0, 0.0, 0.0, 0.0, 0.0, 300.0, '20191009']
        ], 'data': ['GMARQUES', '0901', 'JHONY CESAR ', '--', 0.0, 300.0, 830.0, 0.0, 0.0, 0.0, 1130.0, '--']
    }
    ];
    return <Tabela cabe={cabe} corpo={corpo} dinamico />;
}

dinamico.story = {
    parameters: {
        docs: {
            storyDescription: 'Uma tabela usando recursos dinamicos. Cada registro deve vir com um atributo dinamico que deve ser um array aninhado de outro array que ficará oculto na maioria do tempo. Clicar sobre os "+" expande e oculta os registros dinamicos da tabela.'
        }
    }
};

export const baixar = ()=>{ 
let cabe = ["EMPRESA", "LOJA", "DINHEIRO", "CARTAO DEBITO", "CARTAO CREDITO", 
"VENDAS", "DESCONTO MEDIO"];
let corpo = [
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433]
];
return <Tabela cabe={cabe} corpo={corpo} monetario={[2,3,4]} percentual={[6]} baixar='/baixar_em_excel' />;
}
baixar.story = {
    parameters: {
        docs: {
            storyDescription: 'Uma tabela com a url que permite receber uma versão EXCEL da tabela. Será exibido um modal para seleção dos campos. Então um objeto com {cabe:Array, corpo: Array(Array)} será enviado via POST a esta rota (devido a limitações do storybook o modal não funciona de forma correta).'
        }
    }
}

export const semFiltro = ()=>{
let cabe = ["EMPRESA", "LOJA", "DINHEIRO", "CARTAO DEBITO", "CARTAO CREDITO", 
"VENDAS", "DESCONTO MEDIO"];
let corpo = [
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433]
];
return <Tabela cabe={cabe} corpo={corpo} ocultarFiltro />
};

semFiltro.story = {
    parameters: {
        docs: {
            storyDescription: 'Uma tabela que não tem o filtro. Isto é bem utilizado por tabelas de pequeno porte, ou seja, com poucos registros.'
        }
    }
}
// Com limite de registros
export const comContador = ()=>{
let cabe = ["EMPRESA", "LOJA", "DINHEIRO", "CARTAO DEBITO", "CARTAO CREDITO",  "VENDAS", "DESCONTO MEDIO"];
let corpo = [
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
    ["FMOREIRA - FIL 01", "0101", 200.0, 930.0, 1903.0, 8, 0.11703650680028632,], 
    ["FB - FIL 01", "0201", 573.0, 1735.0, 3590.0, 9, 0.15698188245691558,], 
    ["FMOREIRA - FIL 02", "0102", 630.0, 1210.0, 2674.0, 10, 0.15601270191909433],
];
return <Tabela cabe={cabe} corpo={corpo} contador={20} />   
}

comContador.story = {
    parameters: {
        docs: {
            storyDescription: 'Define um contador de 20, isto quer dizer que 20 registros serão exibidos. ** Cuidado !! Defina o contador para ser maior do que a quantidade de registros que vão caber na tela, é necessário gerar a barra de rolagem para que o usuário possa continuar navegando na tabela'
        }
    }
};