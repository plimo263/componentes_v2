import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import '../css/Tabela.css'
import classNames from 'classnames'
import $ from 'jquery'
import axios from 'axios'
import validator from 'validator'
import Botao from './botao'
import Modal from './modal'
import Logo from './logo'
import Fade from './fade'
import Toggle from './toggle'
import 'jquery-mask-plugin'

class CampoEntrada extends Component {
    render(){
        // monetario e um boleano para convertermos o valor em uma string com casas decimais
        let {monetario, fn, dataRow, dataCell, defaultValue, Tabe} = this.props;
        if(monetario) defaultValue = defaultValue.toFixed(2);
        // Funcao de callback para fechar o campoEntrada no caso do esc ser clicado
        let fnEsc = (e)=>{
            if(e.keyCode === 27){ // Esc pressionado
                let {statusEditaveis} = Tabe.state;
                // Procura o id e idx e então troca o editando para false ou elimina o registro
                let filtro = statusEditaveis.filter(ele=>{
                    return ele.id !== dataRow && ele.idx !== dataCell ? true : false
                });
                Tabe.setState({statusEditaveis: filtro});
            }
        }
        return <form title="PRESSIONE ESC PARA FECHAR O CAMPO DE EDIÇÃO" className='CampoEntrada' data-row={dataRow} 
        data-cell={dataCell} onSubmit={fn}>
            <input onKeyUp={fnEsc} className='form-control' data-row={dataRow} data-cell={dataCell} 
            type="text" defaultValue={defaultValue} name="" id=""/>
        </form>

    }

    componentDidMount(){
        let {mask} = this.props;
        let ref = '.CampoEntrada > .form-control';
        if(mask && Array.isArray(mask)) $(ref).mask(mask[0], mask[1]);
        $(ref).focus() // Dá foco no campo de entrada
    }
}


/**
- Uma tabela responsiva, bonita e customizavel para atender as necessidades do projeto.
- Ela pode trabalhar com conversões de valores monetarios e percentuais.
- Converte datas e telefones, assim como dataHora e também pode somar campos.
- Cabecalho e rodapé customizavel.
- Ordenação de colunas e filtro de campos.
- Edição de dados na tabela assim como uma tabela contraida com registros limitados.
- Bom desempenho para até 30.000 registros.
*/
class Tabela extends Component {
    constructor(props){
        super(props);
        this.state = {
            filtro: null, // vai conter o que foi filtrado
            palavraFiltro: null, // A palavra gerada no filtro
            pesquisando: false, // quando ativo retorna um carregamento para a tabela
            ordem: null, // Determina a ordem informando um objeto com a coluna  ascendencia
            verModalBaixar: null, // Estado que exibe o modal para selecionar colunas a baixar
            statusChecado: this.props.cabe.map((ele,idx)=> idx), // Determina os valores checados ou nao
            corpo: this.props.corpo,
            contadorExibicao: this.props.contador, // Um contador que vai determinar quantos saltos são necessarios a cada fatiamento da tabela
            dinamicoExibir: [], // Controla a exibição/ocultacao do registro selecionado como um array
            statusEditaveis: [], // Contem um Array com um objeto {idx:indice, row:ID,  editando:true|false} dos campos editaveis
            digitando: false, // É um estado que registra enquanto o usuario esta digitando para evitar atualizacoes desnecessárias a tabela
        }
        this._refDivCabe = React.createRef();
        this._refDivCorpo = React.createRef();
        // Referencia ao campo de filtro
        this._refFiltro = React.createRef();
        // Referencias a div do cabecalho e a div do corpo
        this._srcDivCabe = null;
        this._srcDivCorpo = null;
    }
    render(){
        return (
            <div style={this.props.style} className='Tabela table table-responsive'>
                <Fade>{this.state.verModalBaixar ? this._renderModal() : null}</Fade>
                {this._renderPainel()}
                {this._renderTabeCabe()}
                {this._renderTabeCorpo()}
            </div>
        )
    }
    // Renderiza o modal para selecionar as colunas a baixar
    _renderModal(){
        let {cabe} = this.props;
        let {statusChecado} = this.state;
        statusChecado = Array.isArray(statusChecado) ? statusChecado : [];
        let style = {
            padding: '5px',
            borderRadius: '5px',
            background: 'firebrick',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
            fontWeight: 'bold'
        }
        return (
            <Modal onFechar={()=> this.setState({verModalBaixar: false})} className="modal-baixar-tabela" titulo={<div style={style}><Logo /> <span>SELECIONE PARA BAIXAR</span></div>}>
            {/*
                <form className="form-tabela-modal">
                {
                    cabe.map((ele,idx)=>{
                        return (
                        <div key={idx} className="checkbox">
                            <label>
                                <input className={idx.toString()} defaultChecked={true} onChange={this._ativaDesativaDownload.bind(this)} type="checkbox" /> {ele}
                            </label>
                        </div>)
                    })
                }
                <Botao onClick={this._iniciarDownloadExcel.bind(this)} className="btn btn-danger">BAIXAR</Botao>
                </form>
            */}
             <form className="form-tabela-modal">
                {
                    cabe.map((ele,idx)=>{
                        return <Toggle key={idx} className={idx.toString()} defaultChecked={statusChecado.includes(idx)} onChange={this._ativaDesativaDownload.bind(this)}>{ele}</Toggle>
                    })
                }
                <Botao onClick={this._iniciarDownloadExcel.bind(this)} className="btn btn-danger">BAIXAR</Botao>
                </form>
            </Modal>
        )
    }
    // Local para ativar/desativar os campos para download
    _ativaDesativaDownload(e){
        let copiaStatus = JSON.parse(JSON.stringify(this.props.statusChecado ? this.props.statusChecado : this.state.statusChecado));
        //let copiaStatus = JSON.parse(JSON.stringify(this.state.statusChecado));
        // Retire a classe e o valor se estiver checado
        let classe = parseInt(e.target.parentNode.classList[1]);
        let checado = e.target.checked;
        // Se for checado adiciona(caso nao exista, senao remove, caso exista para remover)
        if(checado && copiaStatus.indexOf(classe) === -1){
            copiaStatus.push(classe);
        } else if(!checado && copiaStatus.indexOf(classe) !== -1){
            copiaStatus.splice(copiaStatus.indexOf(classe),1);
        }        
        this.setState({ statusChecado: copiaStatus })

    }
    // Renderiza uma tabela para o cabecalho
    _renderTabeCabe(){
        let className = classNames('table table-bordered table-hover');
        return (
                <div ref={this._refDivCabe} className='tabela-cabe'>
                    <table className={className}>
                        {this._renderCabe()}
                        {this._renderCorpo(true)}
                        {this._renderRodape(true)}
                    </table>
                </div>
        )
    }
    // Renderiza o cabecalho
    _renderCabe(ocultar){
        let {cabe, dinamico} = this.props;
        let {dinamicoExibir, corpo} = this.state;
        let style = Object.assign({cursor: 'pointer'}, 
        ocultar ? Object.assign({visibility: 'collapse'}, this.props.styleCabe) : this.props.styleCabe);
        let className = classNames('', this.props.classNameCabe);
        let fn = this._exibirDinamico;
        return (
        <thead style={style} className={className}>
            <tr onClick={this._ordenar.bind(this)}>
            {/*dinamico ? <th className={className+' coluna-dinamico'} key='dinamico'> </th>: null*/}
            {dinamico ? <th data-row='exibir-geral' onClick={fn.bind(this)} className={className+' coluna-dinamico'} 
                title={Array.isArray(dinamicoExibir) && dinamicoExibir.length === corpo.length ? "OCULTAR TODOS OS REGISTROS" :"EXPANDIR TODOS OS REGISTROS"} 
                key={'dinamico-cabe'}>
                    <i data-row='exibir-geral' className="material-icons">
                        {dinamicoExibir.length > 0 ? 'remove' : 'add'}
                    </i>
                </th> : null}
                {
                    cabe.map((ele,idx)=>{
                        let className2 = classNames(className, {
                                'fixaCabeRoda': this.props.fixaColuna && this.props.fixaColuna.includes(idx)
                            })
                        let tipoEscolhido;
                        if(this.state.ordem && this.state.ordem.coluna === idx){
                            if(this.state.ordem.ascendencia){
                                tipoEscolhido = '\u2193';
                            } else {
                                tipoEscolhido = '\u2191';
                            }
                        } 
                        
                        return (
                        <th className={className2} title='CLIQUE PARA ORDENAR A COLUNA' key={idx}>
                          {tipoEscolhido} {ele}
                        </th>)
                    })
                }
            </tr>
        </thead>
        );
    }
    // Renderiza uma tabela para o corpo
    _renderTabeCorpo(){
        let {tamanho} = this.props;
        let className = classNames('table table-bordered table-hover');
        // Precisa ainda verificar a melhor alternativa
        // Vendo a largura e altura do corpo para aplicar no estilo
        let styleCarregando;
        if(this.state.pesquisando || this.props.pesquisando){
            
            let widthCorpo, heightCorpo, estadoAtual = this.state.pesquisando || this.props.pesquisando;
            widthCorpo = this._srcDivCorpo ? this._srcDivCorpo.clientWidth : 0;
            heightCorpo = this._srcDivCorpo ? this._srcDivCorpo.clientHeight : 0;

            styleCarregando = estadoAtual ? {
                zIndex: 999,
                'width':widthCorpo+'px', 'height': heightCorpo+'px'
            } : null;
            
        }
        
        return (
            <div style={{'maxHeight': tamanho+'px'}}
            ref={this._refDivCorpo} className='tabela-corpo'>
                <Fade>{this.state.pesquisando || this.props.pesquisando ? 
                <div style={styleCarregando} className='pesquisando'>
                CARREGANDO...<i className="material-icons rotacionar">sync</i>
                </div> : null}</Fade>
                <table  className={className}>
                    {this._renderCabe(true)}
                    {this._renderCorpo()}
                    {this._renderRodape()}
                </table>
            </div>
        )
    }
    // Renderiza o corpo
    _renderCorpo(ocultar){
        let corpo = this.state.filtro || this.state.corpo;
        
        let {dinamico, classNameDinamico} = this.props;
        let {contadorExibicao, dinamicoExibir} = this.state;
        
        // VEJA SE O CORPO TEM MAIS DO QUE 100 ITENS, SE SIM VAMOS EXIBIR SOMENTE OS 100 ITENS
        corpo = JSON.parse(JSON.stringify(corpo));
        if(corpo.length > contadorExibicao){
            corpo = corpo.splice(0, contadorExibicao);
        }
        
        let className = classNames('', this.props.classNameCorpo);
        let style = ocultar ? Object.assign({visibility: 'collapse'}, this.props.styleCorpo) : this.props.styleCorpo;
        if(corpo.length < 1){
            return (
                <tbody className={className} style={style}>
                    <tr>
                    {dinamico ? <td key='dinamico'> </td> : null}
                    {
                        this.props.cabe.map((ele,idx)=>{
                            return <td key={idx}>--</td>
                        })
                    }
                    
                    </tr>
                </tbody>
            )
        } 
        let styleTr = this.props.onClick || this.props.onDoubleClick || this.props.onContextMenu ? {cursor:'pointer'} : {};
        return (
            <tbody className={className} style={style}>
                
                {/* RETORNA OS TR DO CORPO */}
                { corpo.map((row,idx)=>{
                    // Veja se existe o rowDinamico
                    let rowDinamico = row.hasOwnProperty('dinamico') ? JSON.parse(JSON.stringify(row.dinamico)) : null;
                    // Se o registro for um objeto, procure por um campo sendo o id
                    // e o outro sendo o data
                    
                    if(!Array.isArray(row) && typeof row === "object" && row.hasOwnProperty('id') && row.hasOwnProperty('data')){
                        idx = row.id.toString();
                        row = row.data;
                    }
                    // Veja se o rowDinamico existe e se dinamico e dinamicoExibir são 
                    return [
                        this._getReg(row, idx, styleTr, corpo, className),
                            (dinamico && Array.isArray(dinamicoExibir) && dinamicoExibir.includes(idx) 
                            && rowDinamico )? 
                            rowDinamico.map((rowDin, ix)=>{
                                return this._getReg(rowDin, ix, styleTr, corpo, classNameDinamico, true)
                            }) : null]
                    })
                }
            </tbody>
        )
    }
    // Funcao que pega o registro selecionado e atualiza o dinamicoExibir para este registro
    _exibirDinamico(e){
        let {dinamicoExibir, corpo,} = this.state;
        
        let idx = e.target.dataset.row;
        
        // Se já foi clicado o retira
        if(Array.isArray(dinamicoExibir) && dinamicoExibir.includes(idx)){
            dinamicoExibir = dinamicoExibir.filter((ele)=> ele !== idx);          
        } else if(idx === 'exibir-geral') {// É uma exibicao geral (quando clica no cabecalho) inclua todos
            // Se o tamanho dos itens do corpo for o mesmo do dinamicoExibir então é para recolher todos
            if(Array.isArray(dinamicoExibir) && dinamicoExibir.length === corpo.length){
                dinamicoExibir = [];
            } else {
                // Percorre todos os registros e adiciona todos os idx
                dinamicoExibir = corpo.map((ele,ix)=>{
                    if(ele.hasOwnProperty('id')){
                        return ele.id.toString()
                    } else {
                        return ix.toString()
                    }
                });
            }
        } else if(Array.isArray(dinamicoExibir)) {
            // Significa que ele ainda não foi clicado então o inclui
            dinamicoExibir.push(idx)
        }
        
        this.setState({dinamicoExibir});
    }
    // Funcao para retornar o registro recebendo a linha em questao
    _getReg(row, idx, styleTr, corpo, className, ocultoBtn){
        let {editaveis, onForm, mask, dinamico, trSelecionado, 
        estiloCampoCondicional, monetario, percentual, dataHora, 
        envolver, datas, telefones} = this.props;
        let {dinamicoExibir, statusEditaveis} = this.state;
        // Veja se temos o trSelecionado, ele determina estilos, 
        // comparando o idx com o id do array do tr
        let style = Object.assign({}, styleTr);
        if(trSelecionado && trSelecionado.hasOwnProperty(idx)) style = Object.assign(style, trSelecionado[idx]);
        let fn = this._exibirDinamico;
        return (
        <tr data-row={idx} key={idx} style={style}
            onClick={this.props.onClick.bind(this)}
            onContextMenu={this.props.onContextMenu.bind(this)}
            onDoubleClick={this.props.onDoubleClick.bind(this)}>
            {dinamico ? <td data-row={idx} onClick={fn.bind(this)} className='coluna-dinamico' title={dinamicoExibir.includes(idx) ? "OCULTAR REGISTRO" :"EXPANDIR REGISTRO"} key={'dinamico-'+idx}>{ocultoBtn ? null :<i  data-row={idx} className="material-icons">{dinamicoExibir.includes(idx) ? 'remove' : 'add'}</i>}</td> : null}
            {
                row.map((cell,cellidx)=>{
                    let cellId, cellCopy, styleTd = {};
                    cellCopy = cell;
                    // Campos podem ser definidos como objetos {id:id, data:''}
                    if(cell && cell.hasOwnProperty('id')){
                        cellId = cell.id;
                        cellCopy = cell.data;
                        // Veja se o td tem um style enviado e entao o defina 
                        if(cell.hasOwnProperty('style')) styleTd = cell.style;
                    }
                                   
                    // Veja se temos estilizacaoCondicional se sim passe os parametros e recebe o retorno da callback
                    if(estiloCampoCondicional && estiloCampoCondicional.hasOwnProperty(cellidx.toString())){
                        styleTd = estiloCampoCondicional[cellidx.toString()](cellCopy, idx, corpo);
                    }
                    // Conversao em campos monetarios
                    if(monetario.includes(cellidx)){
                        cellCopy = this.converter(cellCopy.toFixed(2));
                    } else if(percentual.includes(cellidx)){ // campos de percentual
                        cellCopy = this.percentual(cellCopy);
                    // Se o campo tiver que ter envolvimento, faca-o
                    } else if(Object.keys(envolver).includes(cellidx.toString())){
                        cellCopy = envolver[cellidx](cellCopy, row, idx);
                    } else if(datas.includes(cellidx)){// Se for um campo de data AAAAMMDD usa o conversor de data
                        cellCopy = this.converterData(cellCopy);
                    } else if(telefones.includes(cellidx)){
                        // Chama a funcao de conversao do telefone
                        cellCopy = this.converterTelefone(cellCopy);
                    } else if(dataHora.includes(cellidx)){
                        cellCopy = this.converterDataHora(cellCopy);
                    }
                    
                    let className2 = classNames(className, {
                        'fixaCorpo': this.props.fixaColuna && this.props.fixaColuna.includes(cellidx)
                    });
                    // Se este for o trSelecionado devemos aplicar o estilo ao campo selecionado
                    let keytrSelecionado = trSelecionado ? Object.keys(trSelecionado)[0] : null;
                    if(this.props.fixaColuna && this.props.fixaColuna.includes(cellidx) && keytrSelecionado && keytrSelecionado.toString() === idx.toString()) {
                        style = trSelecionado[keytrSelecionado];
                    }
                    let objAtrCelula = {};
                    objAtrCelula['data-row'] = idx; // indice do regisotr
                    objAtrCelula['data-cell'] = cellidx; // valor da celula
                    //objAtrCelula['style'] = style || {}; // estilo
                    objAtrCelula['className'] = className2; // classe
                    objAtrCelula['key'] = cellidx; // chave
                    // Se o campo for um campo editavel e ativo para edição retorno aqui mesmo
                    if(editaveis && editaveis.includes(cellidx)){
                        objAtrCelula['onDoubleClick'] = this._onAbrirEdicao.bind(this);
                        // Faca um filtro, veja se este indice e este idx existe no statusEditaveis
                        let indiceStatus = -1;
                        
                        statusEditaveis.forEach((ele,ix)=>{
                            
                            if(ele.idx === cellidx && ele.id.toString() === idx.toString() && ele.editando){
                                // E um campo que precisa ser aberto para edicao
                                indiceStatus = ix;
                            }
                        });
                        //
                        if(indiceStatus > -1){
                            //objAtrCelula['style'].padding = 0;
                            let fn = (e)=>{
                                    e.preventDefault();
                                    let val = $(e.target).children().eq(0).val();                                   
                                    let retorno = onForm(e, val, idx, cellidx, cellId); // Passa o id que é referente ao campo
                                    
                                    if(retorno){
                                        statusEditaveis[indiceStatus].editando = false;
                                        this.setState({statusEditaveis})
                                    }

                            }
                            // Veja se a mask existe e se o indice é este mesmo
                            cellCopy = <CampoEntrada Tabe={this} monetario={monetario.includes(cellidx)} 
                            dataRow={idx} dataCell={cellidx} fn={fn} 
                            mask={mask && mask.hasOwnProperty(cellidx) ? mask[cellidx] : null} 
                            defaultValue={cell.hasOwnProperty('id') ? cell.data : cell} />
                        }
                    }
                    return (
                        <td style={styleTd} {...objAtrCelula}>{cellCopy}</td>
                    )
                })
            }                        
        </tr>)
    }
    // Renderiza o rodape
    _renderRodape(ocultar){
        if(!this.props.calculaRodape && !this.props.rodape) return null;
        let {dinamico} = this.props;
        // Verifica se foi enviado um rodape
        let roda = this.props.rodape || this.props.calculaRodape;
        // Se o rodape e um array, somente repassa ele para o loop, senao vamos copiar o cabecalho
        if(!Array.isArray(roda) && roda){
            roda = Array.from(this.props.cabe);
            // Primeiro passo é fazer o loop no corpo e somar qualquer valor numerico que existir
            let totais = [];
            let arrCorpo = this.state.filtro || this.state.corpo;
            arrCorpo.forEach(row=>{
                // Se o registro for um objeto, procure por um campo sendo o id
                // e o outro sendo o data
                if(typeof row === "object" && row.hasOwnProperty('id') && row.hasOwnProperty('data')){
                    row = row.data;
                }
                row.forEach((cell,idx2)=>{
                    if(this.props.monetario.includes(idx2) && !this.props.percentual.includes(idx2)){// o valor e um monetario ?
                        if(!totais[idx2]) totais[idx2] = 0.0;
                        totais[idx2] += cell.hasOwnProperty('id') ? cell.data : cell;
                    } else if(this.props.somar.includes(idx2)){ // somar este numero inteiro
                        if(!totais[idx2]) totais[idx2] = 0;
                        totais[idx2] += cell.hasOwnProperty('id') ? cell.data : cell;
                    }
                });
            });
            roda = roda.map((ele,idx)=>{// verifica se existem valores no indice dos totais e o retorna
                if(!isNaN(totais[idx])) return totais[idx];
                return ele; // senao retorna o elemento do rodape
            });
        }
        // Agora prepara para desenhar o rodape
        let className = classNames('', this.props.classNameRodape);
        let style = ocultar ? Object.assign({visibility: 'collapse'}, this.props.styleRodape) : 
        this.props.styleRodape;
        let corpo = this.state.filtro || this.state.corpo;
        // Se o corpo nao tem nada, vamos retornar um tfoot igual ao thead
        if(corpo.length < 1){
            return (
                <tfoot className={className} style={style}>
                    <tr>
                    {dinamico ? <th  key='dinamico'> </th> : null}
                    {
                        this.props.cabe.map((ele,idx)=>{
                            
                            return <th key={idx}>{ele}</th>
                        })
                    }
                    
                    </tr>
                </tfoot>
            )
        }
        // Extrais o objeto de calculo do rodape
        let {objCalculaRodape} = this.props;

        // tem dados, vamos retornar o tfoot
        return (
            <tfoot className={className} style={style}>
                <tr>
                {dinamico ? <th className={className} key='dinamico'> </th> : null}
                {
                    roda.map((ele,idx)=>{
                        let className2 = classNames(className, {
                                'fixaCabeRoda': this.props.fixaColuna && this.props.fixaColuna.includes(idx)
                            });
                        // Veja se este campo do rodape precisa ser calculado.
                        // se sim invoque o callback passando o (valor, idxRoda, roda)
                        if(objCalculaRodape && objCalculaRodape.hasOwnProperty(idx.toString())){
                            ele = objCalculaRodape[idx.toString()](ele, idx, roda);
                        }

                        ele = this.props.monetario.includes(idx) ? this.converter(parseFloat(ele).toFixed(2)) : ele;
                        // Veja se o campo e um numero e faz parte do percentual. Se for aplica o percentual, senao deixa como esta
                        ele = !isNaN(ele) && this.props.percentual.includes(idx) ? this.percentual(ele) : ele;
                        return <th className={className2} key={idx}>{ele}</th>
                    })
                }
                </tr>
            </tfoot>
        ) 
    }
    // Metodo interno que inicializa a rotina de download enviando um objeto chamado
    // objeto com os campos cabe e corpo para o link informado via post
    _iniciarDownloadExcel(e){
        e.preventDefault();
        let {baixar, cabe, monetario, percentual, dataHora, datas, dinamico, telefones} = this.props;
        let {statusChecado, dinamicoExibir} = this.state;
        let corpo = JSON.parse(JSON.stringify(this.state.filtro || this.state.corpo));
        
        let newCorpo = [], newCabe = [];
        cabe.forEach((ele,idx)=>{
            if(statusChecado.indexOf(idx) !== -1){
                newCabe.push(ele);
            }
        })

        let fnConverter = (val, ix)=>{
            if(monetario.includes(ix)){
                return this.converter(val.toFixed(2));
            } else if(percentual.includes(ix)){
                return this.percentual(val);
            } else if(datas.includes(ix)){
                return this.converterData(val);
            } else if(telefones.includes(ix)){
                return this.converterTelefone(val)
            } else if(dataHora.includes(ix)){
                return this.converterDataHora(val);
            } else {
                return val;
            }
        }
        
        corpo.forEach(ele=>{
            //
            // Colocando o ele como registro (se row.data)
            let arrInterno = [];
            let reg = [];
            if(ele.hasOwnProperty('data')){
                reg = ele.data;
            } else {
                reg = Array.from(ele);
            }
            // Registros para download
            reg.forEach((cp,idx)=>{
                if(statusChecado.indexOf(idx) !== -1){
                    // Se tiver um id entao envia o data
                    if(cp && cp.hasOwnProperty('id')) cp = cp.data;
                    arrInterno.push(fnConverter(cp, idx))
                }
            });
            
            newCorpo.push(arrInterno);
               
            if(!dinamico) return false;
            
            // Veja se nesta sequencia temos o dinamico, se sim o insira tambem
            if(Array.isArray(dinamicoExibir) && ele.hasOwnProperty('dinamico') && dinamicoExibir.includes(ele.id.toString())){
                
                ele.dinamico.forEach((row)=>{
                    let arrDinamico = [];
                    row.forEach((cell,idx)=>{
                        arrDinamico.push(fnConverter(cell, idx));
                    });
                    newCorpo.push(arrDinamico)
                })
            }
        });
        // Iniciando o download
        let formData = new FormData();
        formData.append('objeto', JSON.stringify({'cabe': newCabe, 'corpo': newCorpo}));
        axios.post(baixar, formData).then(resp=>{
            let a = document.createElement('A');
            a.href = resp.data;
            a.download = resp.data.substr(resp.data.lastIndexOf('/') + 1);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            // Fechar o modal
            this.setState({
                statusChecado: this.props.cabe.map((ele,idx)=> idx),
                verModalBaixar: null,
            });

        }).catch(err=>{
            alert('ERRO AO TENTAR FAZER O DOWNLOAD DA TABELA EM EXCEL');
            console.log(err);
        });

    }
    // Metodo que retorna um painel com opcoes
    _renderPainel(){
        let className = classNames('form-control');
        let filtro = this.state.filtro || this.state.corpo;
        // Veja a propriedade children, conte quantos itens tem e os espalhe
        // sobre o painel superior
        let arr = React.Children.toArray(this.props.children);
        // Veja se baixar foi retornado, se sim insere um botao para download
        let {baixar} = this.props;
        if(baixar){
            /* DESATIVADO PARA MUDAR O BOTAO DE DOWNLOAD VISUALMENTE
            arr.push(
                <Botao key='baixar_em_excel' title="BAIXAR EM EXCEL" 
                onClick={()=> this.setState({verModalBaixar: true})}
                 className="baixar-em-excel btn-xs btn-danger">BAIXAR</Botao>
            )
            */
            arr.splice(0, 0, 
                <i key='baixar_em_excel' title="BAIXAR EM EXCEL" 
                onClick={()=> this.setState({verModalBaixar: true})} 
                 className="material-icons icone-redondo bg-red text-white">cloud_download</i>
            )
        }
        
        return (
           <div className="painel">
                <div className="filtro">
                    {this.props.ocultarFiltro ? null :
                    [<label key='rotulo'>
                        <input placeholder='PESQUISAR' ref={this._refFiltro}
                        onKeyUp={this._onFiltro.bind(this)} 
                        type="search" className={className} />
                    </label>,
                    <span key='info-filtro' className="info-registros">
                        TOTAL: {filtro.length} 
                    </span>]
                    }
                </div>
                <div style={{display:'flex', flex:'1'}}>{arr}</div>
            </div>
        )
    }
    // Metodo que abre o campo para edição (ou fecha dependendo do estado)
    _onAbrirEdicao(e){
            
        let {statusEditaveis} = this.state;
        let idx = parseInt(e.target.dataset.cell);
        let row = e.target.dataset.row;
        let achou = -1;
        statusEditaveis.forEach((ele, ix)=>{
            if(achou > -1) return true; 
            if(ele.id === row && ele.idx === idx){
                ele.editando = true; // reverte o valor de editando (se true, false, se false true)
                achou = ix;
            }
        });
        if(achou === -1){ // Nao existe, vamos incluir ele no array e ja abrir para edicao
            statusEditaveis.push({id: row, idx: idx, editando: true})
        }
        this.setState({statusEditaveis})
            
    }
    // Metodo para tratar de retornar o conteudo do filtro quando se envia o corpo e a palavra 
    // a ser procurada
    _aplicarFiltro(corpo, palavra){
        let copiaCorpo = JSON.parse(JSON.stringify(corpo))
        // Veja se o corpo é um array
        if(!Array.isArray(corpo)) return false;
        // Se a palavra nao tiver sido enviada colocar o valor default ''
        palavra = palavra && palavra.length > 0 ? palavra : '';
        // Aqui que entra toda a eficacia em verificar  e filtrar o conteudo
        let filtro = copiaCorpo.filter(arr=>{
            let achou = false;
            // Verifica se é um objeto, se for pega somente o atributo .data
            arr = (!Array.isArray(arr) && typeof arr === "object") ? arr.data : arr;
            arr.forEach((element,idx) => {
                if(achou) return; // ja achamos, podemos retornar
                if(element === null) return; // Se é nulo prossegue
                // Veja se o valor e composto de {id:id, data:''}
                let copia = element;
                if(copia.hasOwnProperty('id')) element = element.data;

                if(this.props.monetario.includes(idx)){ // monetario
                    element = this.converter(element.toFixed(2));
                } else if(this.props.datas.includes(idx)){ // data
                    element = this.converterData(element);
                } else if(this.props.telefones.includes(idx)){ // telefone
                    element = this.converterTelefone(element);
                } else if(this.props.percentual.includes(idx)){ // percentual
                    element = this.percentual(element);
                } else if(this.props.dataHora.includes(idx)){ // dataHora
                    element = this.converterDataHora(element);
                }
                // Vamos ver se encontramos
                achou = element.toString().toLowerCase().search(palavra.toLowerCase()) !== -1 ? true : false;
            });
            return achou;
        });
        // Retorna o filtro novo que foi criado
        return filtro;
    }
    // Metodo que realiza o filtro
    _onFiltro(e){
        this.setState({ pesquisando: true });
        
        // Lancar a pesquisa
        let copiaCorpo = Array.from(this.state.corpo);
        let valor = e.target.value;
        let filtro = this._aplicarFiltro(copiaCorpo, valor);
        // Recupera e aplica ordenacao
        filtro = this._aplicarOrdenacao(filtro, this.state.ordem)
        
        this.setState({
            filtro,
            palavraFiltro: valor,
            pesquisando: false,
            contadorExibicao: this.props.contador,
        });
    }
    // Metodo para tratar a ordenacao de conteudo
    _aplicarOrdenacao(corpo, ordem){
        if(!Array.isArray(corpo)) return false;
        // Veja se ordem tem as propriedades
        if(!ordem) return corpo;
        if(ordem && (!ordem.hasOwnProperty('ascendencia') || !ordem.hasOwnProperty('coluna'))){
            return corpo; // nao tem, retorne o corpo como ele esta
        }
        // Agora aplica a ordenacao
        let copia = JSON.parse(JSON.stringify(corpo));
        //
        let index = parseInt(ordem.coluna);
        let ascOuDes = !ordem.ascendencia;
        // Aplicando a ordenacao
        copia.sort((a,b)=>{
                a = (!Array.isArray(a)) ? a.data : a;
                b = (!Array.isArray(b)) ? b.data : b;
                // Veja se tem {id,data}
                let valA = (a[index].hasOwnProperty('id')) ? a[index].data : a[index];
                let valB = (b[index].hasOwnProperty('id')) ? b[index].data : b[index];
                // Verifica se a[index] e b[index] sao strings e os coloca em toLowerCase
                if(typeof valA === "string" && typeof valB === "string"){
                   return ascOuDes ? (valA.toLowerCase() > valB.toLowerCase() ) ?
                    1 : -1 : (valB.toLowerCase() > valA.toLowerCase()) ? 1 : -1;
                }
                // Sao numeros devem ser comparados como tal
                return ascOuDes ? (valA > valB) ? 1 : -1 : (valB > valA) ? 1 : -1;
        });
        return copia;

    }
    // Metodo para ordenar o resultado
    _ordenar(e){
        let {dinamico} = this.props;
        // Veja se o click foi no TH se nao foi procure seu pai o cellIndex
        if(e.target.nodeName !== 'TH') e.target = e.target.parentNode;
        // Se tiver dinamico e o click for no indice entao sai fora
        if(dinamico && e.target.cellIndex === 0) return false 
        let index = dinamico ? e.target.cellIndex-1 : e.target.cellIndex; // Para ajudar na ordenacao
        let copia = this.state.filtro ? Array.from(this.state.filtro) : Array.from(this.state.corpo);
        let ascOuDes = this.state.ordem && this.state.ordem.ascendencia ? this.state.ordem.ascendencia : false;
        // Aplicar a ordenacao no campo
        copia = this._aplicarOrdenacao(copia, {coluna: index, ascendencia: !ascOuDes});
        /*
        copia.sort((a,b)=>{
                a = (!Array.isArray(a)) ? a.data : a;
                b = (!Array.isArray(b)) ? b.data : b;
                // Veja se tem {id,data}
                let valA = (a[index].hasOwnProperty('id')) ? a[index].data : a[index];
                let valB = (b[index].hasOwnProperty('id')) ? b[index].data : b[index];
                // Verifica se a[index] e b[index] sao strings e os coloca em toLowerCase
                if(typeof valA === "string" && typeof valB === "string"){
                   return ascOuDes ? (valA.toLowerCase() > valB.toLowerCase() ) ?
                    1 : -1 : (valB.toLowerCase() > valA.toLowerCase()) ? 1 : -1;
                }
                
                    // Sao numeros devem ser comparados como tal
                    return ascOuDes ? (valA > valB) ? 1 : -1 : (valB > valA) ? 1 : -1;
                
        });
        */
        
        this.setState({
            filtro : copia,
            contadorExibicao: this.props.contador,
            ordem : {
                coluna: index,
                ascendencia : !ascOuDes
            },
            carregamento: false
        })

    }
    //Depois de montado veja a largura da div corpo com a div cabe
    componentDidMount(){
        let {fixaColuna} = this.props;

        // Pegando a largura das duas divs internas para controlar a barra de rolagem
        this._srcDivCabe = ReactDOM.findDOMNode(this._refDivCabe.current);
        this._srcDivCorpo = ReactDOM.findDOMNode(this._refDivCorpo.current);
        let widthCabe = this._srcDivCabe.clientWidth;
        let widthCorpo = this._srcDivCorpo.clientWidth;
        // Calcula o padding que vamos usar na tabela cabe
        let paddingRigth = widthCabe - (widthCabe - widthCorpo);
        this._srcDivCabe.style.width = paddingRigth+'px' ;
        // Ligar evento scrollLeft da tabela
        document.querySelector('.tabela-corpo').addEventListener('scroll', this._manipularScrollLeft.bind(this));
        // Fixando as colunas a esquerda
        if(fixaColuna){
            this._fixaColunaAEsquerda();
        }
        
    }
    //
    componentDidUpdate(){
        let {fixaColuna} = this.props;
        // Se a largura da div do cabe for igual ao da div do corpo, então atualiza visualmente
        // Pegando a largura das duas divs internas para controlar a barra de rolagem
        ///*
        let widthCabe = this._srcDivCabe.clientWidth;
        let widthCorpo = this._srcDivCorpo.clientWidth;
        if(widthCabe !== widthCorpo){
            this._srcDivCabe.style.width = widthCorpo+'px';
        }
        // Fixando a coluna a esquerda
        if(fixaColuna){
            this._fixaColunaAEsquerda();
        }
        //*/
    }
    componentWillUnmount(){
       document.querySelector('.tabela-corpo').removeEventListener('scroll', this._manipularScrollLeft.bind(this));
    }   
    componentWillReceiveProps(nextProps) {
        // Necessario comparar cabecalhos, diferentes ? atualizar estado
        let{corpo, cabe} = nextProps;
        // Depois comparar tamanho dos corpos, diferentes ? atualizar estado
        if(corpo.length !== this.state.corpo.length || cabe.length !== this.props.cabe.length){
        //if(corpo.length !== this.state.corpo.length){
            //this.setState({corpo: corpo, filtro: null, ordem: null}) Perde ordem e filtro
            // Pega o valor do filtro
            let filtro = this._aplicarFiltro(corpo, this.state.palavraFiltro);
            let {ordem} = this.state; // Recupera a ordem para aplicarmos a ordem acima do filtro
            filtro = this._aplicarOrdenacao(filtro, ordem);
            //if(ordem) ordem.ascendencia = !ordem.ascendencia;
            this.setState({corpo: corpo, filtro: filtro, ordem})// 
            return true;
        }
        // Comparar conteudo dos corpos (item a item), algum item diferente ? atualizar estado
        let atualizar = false;
        corpo.forEach((row,idx)=>{
            // Quebrando o loop quando consegue identificar que 
            // um item é divergente
            if(atualizar) return;
            
            if(Array.isArray(row)){
                
                row.forEach((cell,id)=>{
                    if(atualizar) return; // Se for verdadeiro sai fora
                    if(cell !== this.state.corpo[idx][id]) atualizar = true;
                })
            } else if(row.hasOwnProperty('data')) { // estilo {id: data}
                // Da uma olhada no id, se for diferente ja sai fora
                if(row.id !== this.state.corpo[idx].id) atualizar = true;
                row.data.forEach((cell, id)=>{
                    if(atualizar) return; // Se for verdadeiro sai fora
                    if(cell !== this.state.corpo[idx][id]) atualizar = true;
                })
            }
        })
        //
        ///*
        window.setTimeout(() => {
            if(atualizar){
                let filtro = this._aplicarFiltro(corpo, this.state.palavraFiltro);
                let {ordem} = this.state; // Recupera a ordem para aplicarmos a ordem acima do filtro
                filtro = this._aplicarOrdenacao(filtro, ordem);
                //if(ordem) ordem.ascendencia = !ordem.ascendencia;
                this.setState({corpo: corpo, filtro: filtro, ordem})// 
                return true;
            }    
        }, 100);
        //*/
        return true
    }
    
    // Metodo que controla o scroll
    _manipularScrollLeft(e){
        let piso = this.props.tamanho + 20;
        let {scrollLeft, scrollHeight, scrollTop} = e.target;
        let {contadorExibicao} = this.state;
        let atingi = (scrollHeight - scrollTop);
        if(atingi < piso){
            contadorExibicao += 20;
            this.setState({contadorExibicao});
        }
        this._srcDivCabe.scrollLeft = scrollLeft;
    }
    // Metodo para converter os valores em monetario
    converter(valor){
        valor = valor.replace('.',',');// Substituindo ponto por virgula
        let valorReverso = valor.split("").reverse(); // Reverte a string
        let recebeConvertido = '';
        let x = 0;// Contado a cada 3 vai incluir ponto
        for(let i =0;i< valorReverso.length;i++){
            // Se o x for inferior a 4 entao vamos incrementar x e colocar o caractere
            if(x < 4){
                x += 1
                recebeConvertido += valorReverso[i];
            } else if(x % 3 === 0){ // X nao tem resto na divisao por tres, entao incluiremos o ponto e incrementamos x
                recebeConvertido += '.' + valorReverso[i];
                x += 1
            // X já e maior que 4 e nao e divisivel por 3, entao vamos incrementar x e adicionar o caractere a d
            } else {
                recebeConvertido += valorReverso[i];
                x += 1
            }
        }
        //# Reverte novamente a string para o formato de ordem original
        let valor2 = recebeConvertido.split("").reverse();
        if(valor2[0] === '.'){valor2[0] = '';}
        else if(valor2[0] === '-' && valor2[1] === '.'){ valor2[1] = '';}

        valor2 = 'R$ '+valor2.join("");
        return valor2;

    };
    // Metodo para converter o valor percentual
    percentual(valor){
        let newValor = (valor * 100).toFixed(2);
        return newValor+' %';
    }
    // Metodo para converter ao telefone
    converterTelefone(valor){
        valor = valor.toString();
        if(valor.length === 0 || !validator.isNumeric(valor)) return valor; // Nao e um numero, ja retorna
        // Se seu tamanho for menor que 7, ja o retorna
        if(valor.length < 7) return valor;
        // Agora vamos fazer a reversao do numero
        valor = valor.split('')
        valor.reverse()
        let ult = valor.splice(0, 4);
        ult.reverse(); valor.reverse();
        return [valor.join(''), ult.join('')].join('-');
    }
    // Metodo para converter campos e data
    converterData(valor){
        let reg = /^[1-2][0-9][0-9][0-9]([0][1-9]|[1][0-2])([0-2][0-9]|[3][0-1])$/g;
        let reg2 = /^[1-2][0-9][0-9][0-9]-([0][1-9]|[1][0-2])-([0-2][0-9]|[3][0-1])$/g;
        if(reg.test(valor)){ // Regex para AAAAMMDD
            valor = valor.split('');
            let ano, mes, dia;
            ano = valor.splice(0, 4).join('');
            mes = valor.splice(0, 2).join('');
            dia = valor.join('');
            return `${dia}/${mes}/${ano}`;
        } else if(reg2.test(valor)){ // Regex para AAAA-MM-DD
            valor = valor.split('-');
            let ano, mes, dia;
            ano = valor.splice(0, 1).join('');
            mes = valor.splice(0, 1).join('');
            dia = valor.join('');
            return `${dia}/${mes}/${ano}`;
        }
        return valor;
    }
    // Metodo para converter data_hora
    converterDataHora(valor){
        let dataHora = valor.trim().split(' ')
        let dataRetorno = this.converterData(dataHora[0]);
        return [dataRetorno, dataHora[1]].join(' ')
    }
    // Este metodo fixa as colunas á esquerda que estão com as classes fixaRodaCabe e fixaColuna
    _fixaColunaAEsquerda(){
        /* Pega todos que tem a classe fixaCabeRoda e fixaCorpo e diz que a posicao deles vai ser fixa */
        $('.fixaCorpo, .fixaCabeRoda').each((ind, ele)=>{
            ele.style.zIndex = '50';
            let irmao = $(ele).prev();
            if(irmao.length === 1){ 
                /*
                    // Se tem um irmao pega a posicao á esquerda dele
                    e soma a largura do campo + 1, este será o tanto á esquerda
                    que este campo vai andar
                 */
                 
                let inteiro = 0;
                if(irmao[0].style.left){
                   inteiro =  parseInt(irmao[0].style.left.replace('px', ''));
                } else {// bom este irmao nao e fixo, temos que ver todos os seus subjacentes e pegar o valor deles
                    $(irmao[0]).prevAll().each((ind,ele2)=>{
                        inteiro += ele2.clientWidth;
                    });
                }
                
                ele.style.left = inteiro + 1 + irmao[0].clientWidth+'px';
            } else {
                // não tem irmao, simplesmente da o valor de 0px a esquerda
               ele.style.left = '0px';
            }
        });
    }
}

Tabela.propTypes = {
    /** Um array de strings para representar o cabecalho */
    cabe: PropTypes.arrayOf(PropTypes.string).isRequired,
    /** Um array aninhado com outros arrays ou objetos */
    corpo: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({ 
                id: PropTypes.string, data: PropTypes.array
            }),
            
        ]).isRequired
    ),
    /** Um array que permite preencher os valores do rodape da forma que desejar */
    rodape: PropTypes.array,
    /** Um array de indices para informar quais colunas fixar a esquerda caso tenha barra de rolagem */
    fixaColuna: PropTypes.arrayOf(PropTypes.number.isRequired),
    /** Uma função de callback para responder a cliques do usuário */
    onClick: PropTypes.func,
    /** Uma função de callback para responder a duplos cliques nos registros */
    onDoubleClick: PropTypes.func,
    /** Uma função de callback para responder a clique com o botão direito */
    onContextMenu: PropTypes.func,
    /** Um array com indices dos campos monetarios que se deseja converter */
    monetario: PropTypes.arrayOf(PropTypes.number),
    /** Um array com indices dos campos que se deseja converter em percentual */
    percentual: PropTypes.arrayOf(PropTypes.number),
    /** Uma array com os indices dos campos que se deseja somar números. */
    somar: PropTypes.arrayOf(PropTypes.number),
    /** Um array com os indices dos campos de data/hora a serem convertidos para DD/MM/AAAA HH:MM */
    dataHora: PropTypes.arrayOf(PropTypes.number),
    /** Um array com os indices de datas a serem convertidas para DD/MM/AAAA */
    datas: PropTypes.arrayOf(PropTypes.number),
    /** Um array com indices dos campos a serem convertidos para telefone 9999-9999 ou 99999-9999 */
    telefones: PropTypes.arrayOf(PropTypes.number),
    /** Um objeto com os indices dos campos que devem ser envolvidos. EX: {1: (celula, registro, id)=>{} } */
    envolver: PropTypes.objectOf(PropTypes.number),
    /** Um objeto com o indice do campo que foi selecionado e um objeto que representa um style. EX: {1: {color:'blue'}} */
    trSelecionado: PropTypes.objectOf(PropTypes.number),
    /** Um objeto com indices e cada indice com uma função de callback qu determina um estilo para uma coluna. Este callback recebe o valor e a implementação fica por você. É esperado um objeto. EX: {1: (valor, idxReg, corpoTabela)=> {color:blue} } */ 
    estiloCampoCondicional: PropTypes.objectOf(PropTypes.number),
    /** Um booleano que informa se o rodape deve ficar visivel ou não */
    calculaRodape: PropTypes.bool,
    /** Uma string que represente uma classe para ser colocada na raiz da tabela */    
    className: PropTypes.string,
    /** Uma string que represente uma classe para ser colocada no cabecalho da tabela */
    classNameCabe: PropTypes.string,
    /** Uma string que represente uma classe para ser colocada no corpo da tabela */
    classNameCorpo: PropTypes.string,
    /** Uma string que represente uma classe para ser colocada no rodape da tabela */
    classNameRodape: PropTypes.string,
    /** Um objeto de estilo para ser inserido na div que envolve a tabela */
    style: PropTypes.object,
    /** Um objeto de estilo para ser inserido no cabecalho da tabela */
    styleCabe: PropTypes.object,
    /** Um objeto de estilo para ser inserido no corpo da tabela */
    styleCorpo: PropTypes.object,
    /** Um objeto de estio para ser inserido no rodape da tabela */
    styleRodape: PropTypes.object,
    /** Uma string que represente a url de onde se vai conseguir baixar a tabela */
    baixar: PropTypes.string,
    /** Um  array de indices dos campos que já devem ficar marcados como checked assim que o modal aparecer */
    statusChecado: PropTypes.arrayOf(PropTypes.number),
    /** Um objeto com indices que possibilitam fazer um calculo no rodape recebendo a celula, o rodape. EX: {1: (celula, idx, rodape)=> {} } */
    objCalculaRodape: PropTypes.objectOf(PropTypes.number),
    /** Um numero que representa o tamanho vertical da tabela (em pixels) */
    tamanho: PropTypes.number,
    /** Um booleano que determina se a tabela dinamica será ativada ou não. Esta depende do envio do atributo dinamico em cada registro do corpo. EX: corpo = [{id:'', data: [], dinamico: []}] */
    dinamico: PropTypes.bool,
    /** Uma string que vai informar qual a classe a ser aplicada aos registros dinamicos exibidos */
    classNameDinamico: PropTypes.string,
    /** Informa os indices das Colunas que serão editaveis pelo usuário quando o mesmo der um duplo clique */
    editaveis: PropTypes.arrayOf(PropTypes.number),
    /** Uma função de callback usada para dar a resposta sobre a edição do registro. O callback recebe os seguintes paramêtros, (evento, valor, idx, cellIdx, cellId) => {} O retorno deve ser true (para confirmar a edição) ou false (para não confirmar). */
    onForm: PropTypes.func,
    /** Um objeto com indices dos campos que serão aplicadas as mascaras. Ele faz conjunto com os editaveis. EX: {1: ['0000', {reverse:true}]} */
    mask: PropTypes.objectOf(PropTypes.number),
    /** Um boleano que determina se a tabela esta aguardando algo ou não. */
    pesquisando: PropTypes.bool,
    /** Um boleano que quando enviado oculta o campo de filtro criando uma tabela mais clean. É usado em tabela de pequenas quantidades de registros */
    ocultarFiltro: PropTypes.bool,
    /** Algo para ser inserido na parte superior da tabela. Podem ser elementos, texto o que desejar. É muito usado para inserir opções extras a tabela */
    children: PropTypes.any,
    /** Um valor numérico para determinar quantos registros serão exibidos na tabela */
    contador: PropTypes.number,
};

Tabela.defaultProps = {
    onClick: ()=> {},
    onDoubleClick: ()=> {},
    onContextMenu: ()=> {},
    contador: 100,
    monetario: [], 
    percentual: [],
    somar: [], 
    dataHora: [],
    datas: [], // Um array que vai indicar os campos que precisam ter a data formatada
    telefones: [], // Um array com os indices que serão convertidos para telefone
    envolver: {},
    trSelecionado: null, 
    calculaRodape: false,
    fixaColuna: null, // um array que recebe numeros para fixar as colunas
    className: '', // classe principal
    classNameCabe: '', // classe do cabecalho da tabela
    classNameCorpo: '', // classe do corpo da tabela
    classNameRodape: '', // classe do rodape da tabela
    styleCabe: {}, // estilo do cabecalho
    styleCorpo: {}, // estilo do corpo
    styleRodape: {}, // estilo do rodape
    baixar: null, // Para baixar a tabela em versao excel
    objCalculaRodape: null, // Para fazer o calculo em um campo do rodape
    
    tamanho: 250, // Tamanho da tabela
    dinamico: false, // informa se a tabela é dinamica ou nao
    classNameDinamico: 'text-danger', // A classe dinamica para os subregistros
    editaveis: null, // Informa os indices das colunas que serão editaveis
    onForm: (e)=>{ e.preventDefault(); return true}, // Funcao de callback usada para responder a um evento enter quando o campo de edição receber o enter
    mask: null, // As mascaras que devem ser aplicadas ao campo de edição
};



export default Tabela;