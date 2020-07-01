import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import '../css/PadraoFormLojas.css';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Botao from './botao';
import makeAnimated from 'react-select/animated';
import Fade from './fade';
import Carregar from './carregar';
//
const animetedComponents = makeAnimated();

/**
- Submeta campos para uma rota e recupere a resposta de forma padronizada e com verificação de valores.
- Formulário com seleção multipla de valores para lojas com campo data padrão.
- Funcoes de callback podem ser repassadas para antes e depois dos dados serem submetidos assim como em casos de erro.
- Permite uma submissão automática antes mesmo do usuário clicar para solicitar os dados
 */



class PadraoFormLojas extends React.Component {
    componentDidMount(){
        if(this.props.autoEnvio ) this._enviar();
    }
    constructor(props){
        super(props);
        let {lojas, grifes, fornecedores} = this.props;
        this.state = {
            de: this.props.de,
            ate: this.props.ate
        };
        // Os selecionados
        let grifesSelect, fornecedoresSelect;
        switch(this.props.tipo){
            default:
            case 'padrao':                
            case 'lojas':
                this.state.lojas = {total: this._formatar(lojas.total, true), selecionadas: this._obterDefault(lojas.selecionadas, lojas.total)};
                break;
            //
            case 'lojas_mes_ano': // Inicializa os estados para  grupos, lojas e os meses com o ano
                //
                this.state.lojas = {total: this._formatar(lojas.total, true), selecionadas: this._obterDefault(lojas.selecionadas, lojas.total)};;
                this.state.mes = this._initMes();
                this.state.anoDe = this._initAno(this.props.anoDe);
                break;
            //
            case 'de_e_ate': // Inicializa nada
                break;
            //
            case 'lojas_sem_de_e_ate': // Formulario com lojas sem de e ate
            case 'padrao_sem_de_e_ate':
                this.state.lojas = {total: this._formatar(lojas.total, true), selecionadas: this._obterDefault(lojas.selecionadas, lojas.total)};
                break;
            //
            case 'tipos_grifes_fornecedores': // Inicializa o formulario com ar/oc, fornecedores e grifes
                this.state.arOc = {total: this._formatar(this.props.tipos, true), selecionadas: this._obterDefault(this.props.tipos[0][0],this.props.tipos) };
                
                fornecedoresSelect = this._obterDefault(fornecedores.selecionadas, fornecedores.total);
                this.state.fornecedores = {total: this._formatar(fornecedores.total, true), selecionadas: fornecedoresSelect};

                grifesSelect = this._obterDefault(grifes.selecionadas, grifes.total);
                this.state.grifes = {total: this._formatar(grifes.total, true), selecionadas: grifesSelect};
                break;
            //
            case 'lojas_de_ate_de_venc_ate_venc': // Formulario com 4 campos de data e grupos_lojas
                this.state.lojas = {total: this._formatar(lojas.total, true), selecionadas: this._obterDefault(lojas.selecionadas, lojas.total)};
                this.state.de_venc = this.props.de_venc;
                this.state.ate_venc = this.props.ate_venc;
                break;
            //
            case 'lojas_ano': // Inicializa os estados para lojas e o anoDe
                this.state.lojas = {total: this._formatar(lojas.total, true), selecionadas: this._obterDefault(lojas.selecionadas, lojas.total)};
                this.state.anoDe = this._initAno(this.props.anoDe);
                break;
            //
            case 'lojas_tipos_grifes': // Formulario com as lojas, seus tipos e grifes
                this.state.lojas = {total: this._formatar(lojas.total, true), selecionadas: this._obterDefault(lojas.selecionadas, lojas.total)};
                this.state.arOc = {total: this._formatar(this.props.tipos, true), selecionadas: this._obterDefault(this.props.tipos[0][0],this.props.tipos) };
                grifesSelect = this._obterDefault(grifes.selecionadas, grifes.total);
                this.state.grifes = {total: this._formatar(grifes.total, true), selecionadas: grifesSelect};
                break;  
            //
            case 'lojas_meses_entre_anos': // Inicializa os estados para lojas mes anoDe e anoAte
                //
                this.state.lojas = {total: this._formatar(lojas.total, true), selecionadas: this._obterDefault(lojas.selecionadas, lojas.total)};;
                this.state.mes = this._initMes(true); // Informa que vamos usar o modelo de campos multiplos
                this.state.anoDe = this._initAno(this.props.anoDe);
                this.state.anoAte = this._initAno(this.props.anoAte);
                break;
            //
            case 'lojas_tipos': // Inicializa somente as lojas e formata os tipos AR/OC enviados
                this.state.lojas = {total: this._formatar(lojas.total, true), selecionadas: this._obterDefault(lojas.selecionadas, lojas.total)};;
                this.state.arOc = {total: this._formatar(this.props.tipos, true), selecionadas: this._obterDefault(this.props.tipos[0][0], this.props.tipos) };
                break;
            //
            case 'padrao_com_caixas': // Inicializa o padrao mas com opcao de inclusao manual dos caixas
                this.state.lojas = {total: this._formatar(lojas.total, true), selecionadas: this._obterDefault(lojas.selecionadas, lojas.total)};
                this.state.caixas = this.props.caixas;
                break;
            case 'padrao_com_montagem': // Inicializa o padrao mas com opcao de montagem
                this.state.lojas = {total: this._formatar(lojas.total, true), selecionadas: this._obterDefault(lojas.selecionadas, lojas.total)};
                this.state.montagem = {total: this._formatar(this.props.montagem.total, true), selecionadas: this._obterDefault(this.props.montagem.selecionadas, this.props.montagem.total)};
                break;

        }
        this._refs = [React.createRef(), React.createRef()];
        this._refs_de_venc = React.createRef();
        this._refs_ate_venc = React.createRef();
    }

    _renderPadrao(){
        let {lojas} = this.state;
        let {rotulos} = this.props;
        
        // Entao deve ser exibido tambem o campo lojas
        return [
            <label key='lojas' htmlFor="lojas">
                <span><i className="material-icons">home</i> <i>{rotulos.lojas}:</i></span>
                <Select styles={{menu: (provided, state)=>({...provided, 'zIndex': '999'})} } isDisabled={this.state.aguardar} onChange={(e)=> this._onChange('lojas', e, 0)} 
                        components={animetedComponents} value={lojas.selecionadas} isMulti 
                        options={lojas.total} />
            </label>];
    }
    // Retorna o campo de/ate
    _renderDeAte(idx = 0){
        let {de, ate} = this.state;
        let {rotulos} = this.props;
        
        return [<label key={idx+1} htmlFor="de">
                    <span><i className="material-icons">calendar_today</i> <i>{rotulos.de}:</i></span>
                    <input disabled={this.state.aguardar} onChange={(e)=> this._onChange(e, 'de', idx+1) } ref={this._refs[0]} className='form-control' defaultValue={de} type="date" name="de" id="de"/>
                </label>,
                <label key={idx+2} htmlFor="ate">
                    <span><i className="material-icons">calendar_today</i> <i>{rotulos.ate}:</i></span>
                    <input disabled={this.state.aguardar} onChange={(e)=> this._onChange(e, 'ate', idx+2) } ref={this._refs[1]}  className='form-control' defaultValue={ate} type="date" name="ate" id="ate"/>
                </label>]
    }
    // Retorna os campos de_venc e ate_venc
    _renderDeAteVenc(idx){
        let {de_venc, ate_venc} = this.state;
        let {rotulos} = this.props;
        
        return [<label key={idx+1} htmlFor="de_venc">
                    <span><i className="material-icons">calendar_today</i> <i>{rotulos.de_venc}:</i></span>
                    <input disabled={this.state.aguardar} onChange={(e)=> this._onChange(e, 'de', idx+1) } ref={this._refs_de_venc} className='form-control' defaultValue={de_venc} type="date" name="de_venc" id="de_venc"/>
                </label>,
                <label key={idx+2} htmlFor="ate_venc">
                    <span><i className="material-icons">calendar_today</i> <i>{rotulos.ate_venc}:</i></span>
                    <input disabled={this.state.aguardar} onChange={(e)=> this._onChange(e, 'ate', idx+2) } ref={this._refs_ate_venc}  className='form-control' defaultValue={ate_venc} type="date" name="ate_venc" id="ate_venc"/>
                </label>]
    }
    _renderLojas(){
        return this._renderPadrao();
    }
    // Renderiza o campo AR,OC
    _renderArOc(idx){
        let {arOc} = this.state;
        let {rotulos} = this.props;
        return [
                <label key='ar_oc' htmlFor="ar_oc">
                    <span><i className="material-icons">visibility</i> <i>{rotulos.arOc}:</i></span>
                    <Select styles={{menu: (provided, state)=>({...provided, 'zIndex': '999'})} } isDisabled={this.state.aguardar} onChange={(e)=> this._onChange('ar_oc', e, idx)} 
                            components={animetedComponents} value={arOc.selecionadas} isMulti 
                            options={arOc.total} />
                </label>]

    }
    // Renderiza o campo grifes
    _renderGrifes(idx){
        let {grifes} = this.state;
        let {rotulos} = this.props;
        return [
                <label key='grifes' htmlFor="grifes">
                    <span><i className="material-icons">category</i> <i>{rotulos.grifes}:</i></span>
                    <Select styles={{menu: (provided, state)=>({...provided, 'zIndex': '999'})} } isDisabled={this.state.aguardar} onChange={(e)=> this._onChange('grifes', e, idx)} 
                            components={animetedComponents} value={grifes.selecionadas} isMulti 
                            options={grifes.total} />
                </label>]
    }
    // Renderiza o campo de fornecedores
    _renderFornecedores(idx){
        let {fornecedores} = this.state;
        let {rotulos} = this.props;
        return [<label key='fornecedores' htmlFor="fornecedores">
                    <span><i className="material-icons">local_shipping</i> <i>{rotulos.fornecedores}:</i></span>
                    <Select styles={{menu: (provided, state)=>({...provided, 'zIndex': '999'})} } isDisabled={this.state.aguardar} onChange={(e)=> this._onChange('fornecedores', e, idx)} 
                            components={animetedComponents} value={fornecedores.selecionadas} isMulti 
                            options={fornecedores.total} />
                </label>]
    }
    // Retorna o campo de selecao dos meses recebendo o default como sendo até o mes
    _renderAteOMes(idx, multiplo){
        let {mes} = this.state;
        return [<label key='ate_o_mes' htmlFor="ate_o_mes">
                    <span><i className="material-icons">calendar_today</i> <i>{this.props.rotulos.ateOMes}:</i></span>
                    <Select styles={{menu: (provided, state)=>({...provided, 'zIndex': '999'})} } isDisabled={this.state.aguardar} onChange={(e)=> this._onChange('mes', e, idx+1)} 
                            components={animetedComponents} value={mes.selecionadas}  isMulti={multiplo}
                            options={mes.total} />
                </label>]
    }
    // Retorna o campo de selecao dos anos
    _renderAno(obj, idx, tipoAno, rotulo){
        
        return [<label key={idx} htmlFor={tipoAno}>
                    <span><i className="material-icons">calendar_today</i> <i>{rotulo}:</i></span>
                    <Select styles={{menu: (provided, state)=>({...provided, 'zIndex': '999'})} } isDisabled={this.state.aguardar} onChange={(e)=> this._onChange(tipoAno, e, idx+1)} 
                            components={animetedComponents} value={obj.selecionadas}  
                            options={obj.total} />
                </label>]
    }
     // Retorna o campo de entrada para as caixas
     _renderCaixas(idx){
        let {caixas} = this.state;
        return [<label key='caixas' htmlFor="caixas">
                    <span><i className="material-icons">money</i> <i>{this.props.rotulos.caixas}:</i></span>
                    <input type='text' name='caixas' disabled={this.state.aguardar} className='form-control'
                        onChange={(e)=> this._onChange('caixas', e, idx+1)} defaultValue={caixas} />
                </label>]
    }
    // Renderiza o campo de montagens
    _renderMontagem(idx){
        let {montagem} = this.state;
        let {rotulos} = this.props;
        return [
                <label key='montagem' htmlFor="montagem">
                    <span><i className="material-icons">category</i> <i>{rotulos.montagem}:</i></span>
                    <Select styles={{menu: (provided, state)=>({...provided, 'zIndex': '999'})} } isDisabled={this.state.aguardar} onChange={(e)=> this._onChange('montagem', e, idx)} 
                            components={animetedComponents} value={montagem.selecionadas} isMulti 
                            options={montagem.total} />
                </label>]
    }

    render(){
        // Renderiza baseado no tipo
        let {tipo} = this.props;
        let {erro} = this.state;
        // Switch para ver qual grupo selecionado
        let renderizar;
        switch(tipo){
            case 'lojas':
            case 'padrao':
                renderizar = this._renderLojas().concat(this._renderDeAte(0));
                break;
            case 'lojas_mes_ano': //
                renderizar = this._renderLojas().concat(this._renderAteOMes(0)).concat(this._renderAno(this.state.anoDe, 1, 'anoDe', this.props.rotulos.anoDe));
                break;
            case 'de_e_ate': // Renderiza somente os campos de e ate
                renderizar = this._renderDeAte(0);
                break;
                //
            case 'padrao_sem_de_e_ate': // Rendeiza sem os campos de e ate
            case 'lojas_sem_de_e_ate':
                renderizar = this._renderPadrao();
                break;
            //
            case 'lojas_tipos': // Renderiza os lojas e ar_oc
                renderizar = this._renderLojas().concat(this._renderArOc(1));
                break;
            //
            case 'tipos_grifes_fornecedores': // Renderiza o tipos, fornecedores e grifes
                renderizar = this._renderGrifes(0).concat(this._renderArOc(1)).concat(this._renderFornecedores(2));
                break;
            //

            case 'lojas_meses_entre_anos': // Renderiza com o campo até o mes sendo de multipla escolha
                renderizar = this._renderLojas().concat(
                    this._renderAteOMes(0, true)
                    ).concat(
                    this._renderAno(this.state.anoDe, 1, 'anoDe', this.props.rotulos.anoDe)
                    ).concat(this._renderAno(this.state.anoAte, 2, 'anoAte', this.props.rotulos.anoAte));
                break;
            //
            case 'lojas_de_ate_de_venc_ate_venc': // Renderiza os grupos_lojas com 4 datas
                renderizar = this._renderLojas().concat(this._renderDeAte(1)).concat(this._renderDeAteVenc(2));
                break;
            //
            case 'lojas_ano': // Renderiza lojas e ano (sem os grupos)
                renderizar = this._renderLojas().concat(
                    this._renderAno(this.state.anoDe, 1, 'anoDe', this.props.rotulos.anoDe)
                )
                break;
            //
            case 'lojas_tipos_grifes': // Renderiza as lojas os tipos e grifes
                renderizar = this._renderLojas().concat(
                    this._renderGrifes(1)
                    ).concat(
                        this._renderArOc(2)
                    );
                break;
            //
            case 'padrao_com_caixas': // Desenha o padrao com caixas
                renderizar = this._renderLojas().concat(this._renderDeAte(0)).concat(this._renderCaixas(1));
                break;
            case 'padrao_com_montagem': // Desenha o padrao com as montagens
                renderizar = this._renderLojas().concat(this._renderDeAte(0)).concat(this._renderMontagem(1))
                break;
            default:
                renderizar = this._renderPadrao().concat(this._renderDeAte(1));
                break;
        }
        return <div  className="PadraoFormLojas">
                    <div ref={this._refs[2]} className="form-geral">
                        {renderizar}
                        <Botao disabled={this.state.aguardar} onClick={this._enviar.bind(this)}>{this.state.aguardar ? <Carregar mensagem='AGUARDE' /> :'PESQUISAR'}</Botao>                
                    </div>
                    <Fade>{erro ? this._erro() : null}</Fade>
            </div>;
    }

    
     // Retorna o objeto dos meses com o total e selecionados
    _initMes(multiplo){
        let {mes} = this.props;
        // Agora gera os anos e os meses        
        let meses = [ [1, "JAN"], [2, "FEV"], [3, "MAR"], [4, "ABR"], [5, "MAI"], [6, "JUN"],
            [7, "JUL"], [8, "AGO"], [9, "SET"], [10, "OUT"], [11, "NOV"], [12, "DEZ"] ];
        
        let filtro = meses.filter(ele=> ele[0].toString() === mes.toString()).map(ele=> ele[0].toString()).join(',');
        filtro = multiplo ? this._obterDefault(filtro, meses) : this._obterDefault(filtro, meses)[0];
        meses = this._formatar(meses);
        return {total: meses, selecionadas: filtro}
    }
    // Retorna o objeto do ano para ser usado pelo estado
    _initAno(anoDefault){
        let ano = 2011;        
        let anoAtual = parseInt(new Date().toLocaleDateString('pt-br').split('/')[2]);
        let anos = [];
        while(anoAtual >= ano){
            anos.push(ano);
            ano += 1;
        }        
        anos = this._formatar(anos.map(ele=> ele.toString()));
        //
        return {
            total: anos, 
            selecionadas: {
                label: anoDefault.toString(), 
                key:'999', value: anoDefault
            }
        };
    }


   
    // Retorna mensagem de erro
    _erro(){
        return <span>
                    <i className="material-icons">error</i>
                    <span>{this.state.erro}</span>
                </span>
    }
    // Metodo de envio personalizado com verificacao e retorno
    _enviarAteOMesAno(){
        // Verifica se os campos estão ok
        let {lojas, anoDe, mes} = this.state;
        let obj = {anoDe, mes};                
        // Vamos ver se a loja tem valores e se é maior que 0
        if(!lojas || !Array.isArray(lojas.selecionadas) || lojas.selecionadas.length === 0){
            this.setState({erro: 'FAVOR ESCOLHER A LOJA PARA O FILTRO'});
            return false;
        }
        // Vamos extrair o valor de cada item do array e concatenar para criar a string de valor
        obj.lojas = lojas.selecionadas.map(ele=> ele.value).join(',');
        return obj;
    } 
    /*
        UMA GRANDE QUANTIDADE DE CAMPOS PARA SEREM VALIDADOS
    */
    // Metodo de validacao do tipos (AR,OC,LG,LC)
    _validarTipos(){
        let {arOc} = this.state;
        // Verifica se foi escolhido algum
        if(!arOc || !Array.isArray(arOc.selecionadas) || arOc.selecionadas.length < 1){
            this.setState({erro: 'FAVOR PREENCHER O TIPO COM UMA DAS OPCOES'});
            return false;
        }
        // Validado retorna o selecionado
        return {tipo_ar_oc: arOc.selecionadas.map(ele=> ele.value).join(',')}
    }
    // Metodo para validar as lojas
    _validarLojas(){
        // Verifica se os campos estão ok
        let {lojas} = this.state;                
        // Vamos ver se a loja tem valores e se é maior que 0
        if(!lojas || !Array.isArray(lojas.selecionadas) || lojas.selecionadas.length === 0){
            this.setState({erro: 'FAVOR ESCOLHER A LOJA PARA O FILTRO'});
            return false;
        }
        // Vamos extrair o valor de cada item do array e concatenar para criar a string de valor
        return {lojas: lojas.selecionadas.map(ele=> ele.value).join(',')}
    }
    // Valida se o campo montagem e sufarcagem foi selecionado
    _validarMontagem(){
        // Verifica se os campos estão ok
        let {montagem} = this.state;                
        // Vamos ver se a montagem tem valores e se é maior que 0
        if(!montagem || !Array.isArray(montagem.selecionadas) || montagem.selecionadas.length === 0){
            this.setState({erro: 'FAVOR ESCOLHER O TIPO DE MONTAGEM'});
            return false;
        }
        // Vamos extrair o valor de cada item do array e concatenar para criar a string de valor
        return {tipo: montagem.selecionadas.map(ele=> ele.value).join(',')}
    }
    // Metodo para validar grifes
    _validarGrifes(){
        // Verifica se os campos estão ok
        let {grifes} = this.state;                
        // Vamos ver se a loja tem valores e se é maior que 0
        if(!grifes || !Array.isArray(grifes.selecionadas) || grifes.selecionadas.length === 0){
            this.setState({erro: 'FAVOR ESCOLHER UMA GRIFE PARA O FILTRO'});
            return false;
        }
        // Vamos extrair o valor de cada item do array e concatenar para criar a string de valor
        return {grifes: grifes.selecionadas.map(ele=> ele.value).join(',')}
    }
    // Metodo para validar os fornecedores
    _validarFornecedores(){
        // Verifica se os campos estão ok
        let {fornecedores} = this.state;                
        // Vamos ver se a loja tem valores e se é maior que 0
        if(!fornecedores || !Array.isArray(fornecedores.selecionadas) || fornecedores.selecionadas.length === 0){
            this.setState({erro: 'FAVOR ESCOLHER UM FORNECEDOR PARA O FILTRO'});
            return false;
        }
        // Vamos extrair o valor de cada item do array e concatenar para criar a string de valor
        return {fornecedor: fornecedores.selecionadas.map(ele=> ele.value).join(',')}
    }
    // Metodo para validar o campo de mes
    _validarMes(mes){
       //Selecionou algum mês ?
       if(!mes || (!mes.hasOwnProperty('selecionadas')) || (Array.isArray(mes.selecionadas) && mes.selecionadas.length === 0) ){
           this.setState({erro: 'FAVOR INFORMAR UM MÊS QUE DESEJA PARA O FILTRO'});
           return false;
       }
       // Se for um array recupera seus valores e concatena, senao somente recupera os valores
       return {mes: Array.isArray(mes.selecionadas) ? mes.selecionadas.map(e=> e.value).join(',') : mes.selecionadas.value };
    }
    // Metodo para validar o ano
    _validarAno(ano){
        // Veja se o anoDe é maior que o anoAte
        if(!ano || (!ano.hasOwnProperty('selecionadas'))){
            this.setState({erro: 'O ANO DEVE SER UM NÚMERO'})
            return false;
        }
        return {ano: ano.selecionadas.value};

    }
    // Metodo valida data de e ate
    _validarDeEAte(){
        // Valida os dois primeiros valores de data de e ate
        let de = ReactDOM.findDOMNode(this._refs[0].current).value,
        ate = ReactDOM.findDOMNode(this._refs[1].current).value;
        if(!de){
            this.setState({erro: 'FAVOR INFORMAR A DATA DE'})
            return false;
        } else if(!ate){
            this.setState({erro: 'FAVOR INFORMAR A DATA ATE'})
            return false;
        }
        // Veja se a data de é maior que a ate
        let datas = [de,ate].map(ele=>(
            new Date(`${ele} 00:00:00`)
        ));
        if(datas[0] > datas[1]){
            this.setState({erro: 'A DATA DE NÃO DEVE SER MAIOR QUE A DATA ATÉ'});
            return false;
        }
        // Datas validadas, retorne-as
        return {de, ate};

    }
    //Valida o de vencimento e ate vencimento
    _validarDeEAteVencimento(){
        // Valida os dois primeiros valores de data de e ate
        let de_venc = ReactDOM.findDOMNode(this._refs_de_venc.current).value,
        ate_venc = ReactDOM.findDOMNode(this._refs_ate_venc.current).value;
        if(!de_venc){
            this.setState({erro: 'FAVOR INFORMAR A DATA DE VENCIMENTO'})
            return false;
        } else if(!ate_venc){
            this.setState({erro: 'FAVOR INFORMAR A DATA ATE VENCIMENTO'})
            return false;
        }
        // Veja se a data de é maior que a ate
        let datas = [de_venc,ate_venc].map(ele=>(
            new Date(`${ele} 00:00:00`)
        ));
        if(datas[0] > datas[1]){
            this.setState({erro: 'A DATA DE VENC. NÃO DEVE SER MAIOR QUE A DATA ATÉ VENC.'});
            return false;
        }
        // Datas validadas, retorne-as
        return {de_venc, ate_venc};

    }

    // Fazer a conferencia dos campos e enviar os dados
    _enviar(){
        let obj, objMontagem, objTipos, objDeEAte, objMes, objAnoDe, objAnoAte, objGrifes, objFornecedores, objDeEAteVenc;
        switch(this.props.tipo){
            default:
            case 'lojas':
            case 'padrao':
                obj = this._validarLojas();
                if(!obj){
                    obj = false; return false;
                }
                objDeEAte = this._validarDeEAte();
                if(!objDeEAte){obj = false; return false;}
                obj = Object.assign(obj, objDeEAte);
                break;
            case 'lojas_mes_ano': // Valida as lojas o mes e o ano selecionado
                obj = this._validarLojas();
                if(!obj){ obj = false; return false; }
                // Valida mes
                objMes = this._validarMes(this.state.mes);
                if(!objMes){ obj = false; return false};
                obj = Object.assign(obj, objMes);
                // Valida ano
                objAnoDe = this._validarAno(this.state.anoDe);
                if(!objAnoDe){ obj = false; return false};
                obj = Object.assign(obj, objAnoDe);
                break;
            case 'de_e_ate': // Valida datas de e ate
                obj = this._validarDeEAte();
                if(!obj){obj = false; return false;}
                break;
            case 'lojas_sem_de_e_ate':
            case 'padrao_sem_de_e_ate': // Valida com o padrao sem de e ate
                obj = this._validarLojas();
                break;
            case 'tipos_grifes_fornecedores': // Valida tipos, grifes e fornecedores
                obj = this._validarTipos();
                if(!obj){ obj = false; return false; }
                // Validar as grifes
                objGrifes = this._validarGrifes();
                if(!objGrifes){ obj = false; return false};
                obj = Object.assign(obj, objGrifes);
                // Validar fornecedores
                objFornecedores = this._validarFornecedores();
                if(!objFornecedores){obj = false; return false;}
                obj = Object.assign(obj, objFornecedores);
                break;
            case 'lojas_de_ate_de_venc_ate_venc': // Valida campos de, ate, lojas e de_venc, ate_venc
                obj = this._validarLojas();
                if(!obj){
                    obj = false; return false;
                }
                objDeEAte = this._validarDeEAte();
                if(!objDeEAte){obj = false; return false;}
                obj = Object.assign(obj, objDeEAte);
                objDeEAteVenc = this._validarDeEAteVencimento();
                if(!objDeEAteVenc){obj = false; return false;}
                obj = Object.assign(obj, objDeEAteVenc);
                break;
            case 'lojas_ano': // Valida as lojas e o ano
                obj = this._validarLojas();
                if(!obj){ obj = false; return false; }
                // Valida ano
                objAnoDe = this._validarAno(this.state.anoDe);
                if(!objAnoDe){ obj = false; return false};
                obj = Object.assign(obj, objAnoDe);
                break;
            case 'lojas_tipos_grifes': // Valida as lojas os tipos e as grifes
                obj = this._validarLojas();
                if(!obj){ obj = false; return false; }
                // Valida os tipos
                objTipos = this._validarTipos();
                if(!objTipos){ obj = false; return false; }
                obj = Object.assign(obj, objTipos);
                // Validar as grifes
                objGrifes = this._validarGrifes();
                if(!objGrifes){ obj = false; return false};
                obj = Object.assign(obj, objGrifes);
                break;
            case 'lojas_meses_entre_anos': // Lojas e meses entre os anos
                obj = this._validarLojas();
                if(!obj){obj = false; return false;}
                // Valida o mes
                objMes = this._validarMes(this.state.mes);
                if(!objMes){obj = false; return false;}
                obj = Object.assign(obj, objMes);
                console.log('oi', obj)
                // Valida ano de
                objAnoDe = this._validarAno(this.state.anoDe);
                if(!objAnoDe){obj = false; return false;}
                obj = Object.assign(obj, {de: objAnoDe['ano']});
                // Valida ano ate
                objAnoAte = this._validarAno(this.state.anoAte);
                if(!objAnoAte){obj = false; return false;}
                obj = Object.assign(obj, {ate: objAnoAte['ano']} );
                break;
            case 'lojas_tipos': // Valida as lojas e os tipos
                obj = this._validarLojas();
                if(!obj){obj = false; return false;}
                //
                objTipos = this._validarTipos();
                if(!objTipos){obj = false; return false;}
                obj = Object.assign(obj, objTipos);
                break;
            case 'padrao_com_caixas': // Valida as lojas, de, ate e caixas
                obj = this._validarLojas();
                if(!obj){
                    obj = false; return false;
                }
                objDeEAte = this._validarDeEAte();
                if(!objDeEAte){obj = false; return false;}
                obj = Object.assign(obj, objDeEAte);
                obj.caixas = this.state.caixas;
                break;
            case 'padrao_com_montagem': // Valida as lojas, de, ate e montagem
                obj = this._validarLojas();
                if(!obj){
                    obj = false; return false;
                }
                objDeEAte = this._validarDeEAte();
                if(!objDeEAte){obj = false; return false;}
                obj = Object.assign(obj, objDeEAte);
                objMontagem = this._validarMontagem();
                if(!objMontagem){obj = false; return false;}
                obj = Object.assign(obj, objMontagem);                
                break;
                
        }       
        
        if(!obj) return false; // Deu algo errado, retornar
        
        // Tudo certo, limpa a mensagem de erro (se houver)
        if(this.state.erro) this.setState({erro: null});

        // Executa a funcao de pré-envio passando o objeto criado        
        if(this.props.fnPre){
            this.props.fnPre(obj);
        }

        // Caso presente, permite que os dados sejam modificados
        if(this.props.fnPoli){
            obj = this.props.fnPoli(obj);
        }
        // Fazemos o envio dos dados para a rota informada
        let formData = new FormData();
        formData.append('dados', JSON.stringify(obj));
        
        this.setState({erro: null, aguardar: true})

        axios.post(this.props.rota, formData).then(resp=>{
            if(resp.status !== 200){
                this.setState({aguardar: false,
                    erro: 'ERRO INTERNO DO SERVIDOR, SE PERSISTIR INFORMAR AO ADMIN'});
                return false;
            }
            // Deu tudo certo, veja se tem alguma mensagem de erro
            if(resp.data.hasOwnProperty('erro')){
                this.setState({erro: resp.data.erro, aguardar: false});
                return false;
            }
            // Tudo certo, limpe a mensagem de erro do formulario e chame a função de pós com
            // os novos dados
            this.setState({erro: null, aguardar: false});
            this.props.fnPos(resp.data, obj);

        }).catch(err=>{
            this.setState({aguardar: false, erro: 'ERRO AO TENTAR ENVIAR FORMULÁRIO'});
            console.log(err);
            if(this.props.fnErr) this.props.fnErr(err);
        });
    }
    // Pega um array e formata para o modelo que o select usa e inclui o todos caso desejado
    _formatar(arrTodos, incluirTodos){
        // Converte o padrão em um objeto compreensivel pelo Select
        let objDeTodos = [];
        let arr = arrTodos.map((ele,idx)=>{
            if(Array.isArray(ele)){ 
                // Se tiver a opcao de incluir todos adiciona o item
                if(incluirTodos) objDeTodos.push(ele[0]);
                return {label: ele.length === 2 ? ele[1] : ele[0], key: idx, value: ele[0]}
            }
            // Se tiver a opcao de incluir todos adiciona o item
            if(incluirTodos) objDeTodos.push(ele);
            // Nao e um array, o valor e o rotulo devem ser considerados os mesmos
            return {label: ele, key: idx, value: ele}
        });
        if(objDeTodos.length > 0) arr.push({key:'999', label: 'TODOS', value: objDeTodos.join(',')});
        return arr;
    }
    // pega o valor selecionado junto com o array de todos os 
    //valores e retorna um array com os valores selecionados já formatados
    _obterDefault(valorSelecionado, arrTodos){
        // Passa sobre cada item do arrTodos e tenta encontrar um padrao
        valorSelecionado = valorSelecionado.split(',');
        
        // Se o valor default for do tamanho de todos então o objeto todos deve ser retornado
        if(valorSelecionado.length === arrTodos.length) return [{label: 'TODOS', key:'999', value: valorSelecionado}];

        let padrao = arrTodos.filter(ele=>{     
            return ((Array.isArray(ele) && valorSelecionado.includes(ele[0].toString())) || valorSelecionado.includes(ele))
        });
        
        // Converte o padrão em um objeto compreensivel pelo Select
        return this._formatar(padrao);
    }

    // Funcao para atualizar o estado de um componente selecionado
    _onChange(tipo, e, idx){
        let todos = [];
        let valor = [];
        switch (tipo) {
            case 'lojas':
                let {lojas} = this.state;
                if(!e){ 
                    lojas.selecionadas = [];
                    this.setState({lojas}); return false
                };
                // Se tiver a opção todos retornar somente o todos
                todos = e.filter(ele=> ele.label === 'TODOS');
                if(todos.length > 0){
                    lojas.selecionadas = todos;
                    this.setState({lojas})
                } else {
                    lojas.selecionadas = e;
                    this.setState({lojas});
                }
                valor = e.map(ele=> ele.value);
                break;
            case 'de':
            case 'ate':
                valor.push(e.target.value);
                break;
            case 'caixas':
                let {caixas} = this.state;
                caixas = e.target.value;
                this.setState({caixas});
                valor = [e.target.value];
                break;
            case 'mes': // Referente ate o mes
                let {mes} = this.state;
                if(!e){ 
                    mes.selecionadas = [];
                    this.setState({mes}); 
                    return false; 
                }
                // Se o e for um Array o processo de extração é diferente
                
                if(Array.isArray(e)){
                    todos = e.filter(ele=> ele.label === 'TODOS');
                    if(todos.length > 0){
                        mes.selecionadas = todos;
                        this.setState({mes})
                        valor = e[0].value;
                    } else {
                        mes.selecionadas = e;
                        this.setState({mes});
                        valor = e.map(ele=> ele.value).join(',');
                    }
                } else {
                    mes.selecionadas = e;
                    valor = [e.value];                
                }

                this.setState({mes});
                
                break;
            case 'anoDe': // Referente ao ano
                let {anoDe} = this.state;
                if(!e){ 
                    anoDe.selecionadas = [];
                    this.setState({anoDe}); 
                    return false; 
                }
                //
                anoDe.selecionadas = e;
                this.setState({anoDe});
                valor = [e.value];
                break;
            case 'anoAte': // Referente ao ano até
                let {anoAte} = this.state;
                if(!e){ 
                    anoAte.selecionadas = [];
                    this.setState({anoAte}); 
                    return false; 
                }
                //
                anoAte.selecionadas = e;
                this.setState({anoAte});
                valor = [e.value];
                break;
            case 'ar_oc': // Referente ao campo ar_oc
                let {arOc} = this.state;
                if(!e){ 
                    arOc.selecionadas = [];
                    this.setState({arOc}); 
                    return false; 
                }
                // Se o e for um Array o processo de extração é diferente
                if(Array.isArray(e)){
                    todos = e.filter(ele=> ele.label === 'TODOS');
                    if(todos.length > 0){
                        arOc.selecionadas = todos;
                        this.setState({arOc})
                        valor = e[0].value;
                    } else {
                        arOc.selecionadas = e;
                        this.setState({arOc});
                        valor = e.map(ele=> ele.value).join(',');
                    }
                } else {
                    arOc.selecionadas = e;
                    valor = [e.value];                
                }
                this.setState({arOc});
                break;
            case 'grifes': // Alterar a grife selecionada
                let {grifes} = this.state;
                if(!e){ 
                    grifes.selecionadas = [];
                    this.setState({grifes}); 
                    return false; 
                }
                // Se o e for um Array o processo de extração é diferente
                if(Array.isArray(e)){
                    todos = e.filter(ele=> ele.label === 'TODOS');
                    if(todos.length > 0){
                        grifes.selecionadas = todos;
                        this.setState({grifes})
                        valor = e[0].value;
                    } else {
                        grifes.selecionadas = e;
                        this.setState({grifes});
                        valor = e.map(ele=> ele.value).join(',');
                    }
                } else {
                    grifes.selecionadas = e;
                    valor = [e.value];                
                }
                this.setState({grifes});
                break;
            case 'fornecedores':
            let {fornecedores} = this.state;
                if(!e){ 
                    fornecedores.selecionadas = [];
                    this.setState({fornecedores}); 
                    return false; 
                }
                // Se o e for um Array o processo de extração é diferente
                if(Array.isArray(e)){
                    todos = e.filter(ele=> ele.label === 'TODOS');
                    if(todos.length > 0){
                        fornecedores.selecionadas = todos;
                        this.setState({fornecedores})
                        valor = e[0].value;
                    } else {
                        fornecedores.selecionadas = e;
                        this.setState({fornecedores});
                        valor = e.map(ele=> ele.value).join(',');
                    }
                } else {
                    fornecedores.selecionadas = e;
                    valor = [e.value];                
                }
                this.setState({fornecedores});
                break;
            case 'montagem': // Alterar a montagem selecionada
                let {montagem} = this.state;
                if(!e){ 
                    montagem.selecionadas = [];
                    this.setState({montagem}); 
                    return false; 
                }
                // Se o e for um Array o processo de extração é diferente
                if(Array.isArray(e)){
                    todos = e.filter(ele=> ele.label === 'TODOS');
                    if(todos.length > 0){
                        montagem.selecionadas = todos;
                        this.setState({montagem})
                        valor = e[0].value;
                    } else {
                        montagem.selecionadas = e;
                        this.setState({montagem});
                        valor = e.map(ele=> ele.value).join(',');
                    }
                } else {
                    montagem.selecionadas = e;
                    valor = [e.value];                
                }
                this.setState({montagem});
                break;

            default:
                break;
        }
        // Repassa o valor e o indice
        if(this.props.onChange) this.props.onChange(valor, idx);

    }
}

PadraoFormLojas.defaultProps = {
    tipo: 'padrao',
    rota: window.location.pathname,
    de_venc: new Date().toLocaleDateString().split('/').reverse().join('-'),
    ate_venc: new Date().toLocaleDateString().split('/').reverse().join('-'),
    de: new Date().toLocaleDateString().split('/').reverse().join('-'),
    ate: new Date().toLocaleDateString().split('/').reverse().join('-'),
    anoDe: new Date().toLocaleDateString().split('/').reverse()[0],
    anoAte: new Date().toLocaleDateString().split('/').reverse()[0],
    mes: parseInt(new Date().toLocaleDateString().split('/').reverse()[1]),
    caixas: "",
    montagem: {selecionadas: "M", total: [["M", "MONTAGEM"], ["S", "SUFARÇAGEM"]]},
    rotulos: {
        lojas: 'LOJAS',
        de_venc: 'DE VENC',
        ate_venc: 'ATÉ VENC',
        de: 'DE',
        ate: 'ATÉ',
        anoDe: 'ANO DE',
        anoAte: 'ANO ATÉ',
        ateOMes: 'ATÉ O MÊS',
        arOc: 'TIPOS',
        grifes: 'GRIFES',
        fornecedores: 'FORNECEDORES',
        caixas: 'CAIXAS',
        montagem: 'MONTAGEM / SUFARÇAGEM',
    },
    tipos: [['AR','AR'], ['OC','OC']],
    grifes: {selecionadas: "AHIC", total: [['AHIC', 'AHIC'], ['RBAN', 'RBAN']]}
}

PadraoFormLojas.propTypes = {
    /** Usado para definir o tipo de formulario a ser construido. */
    tipo: PropTypes.oneOf([
        'padrao', 'lojas', 'lojas_mes_ano', 'de_e_ate', 'padrao_sem_de_e_ate',
        'lojas_sem_de_e_ate', 'tipos_grifes_fornecedores', 'lojas_de_ate_de_venc_ate_venc',
        'lojas_ano', 'lojas_tipos_ano', 'lojas_tipos_grifes', 'lojas_meses_entre_anos',
        'lojas_tipos', 'padrao_com_caixas', 'padrao_com_montagem',
        ]).isRequired,
    /** Define os tipos dos produtos se são AR, OC, LG, LC ou os 4 */
    tipos: PropTypes.arrayOf(
        PropTypes.array
    ),
    /** Usado para definir um objeto com as lojas selecionadas (String) e todos (Array[*2]). EX: {selecionadas: '1,2', total: [[1, '01'], [2, '02']]} */
    lojas: PropTypes.shape({
        selecionadas: PropTypes.string.isRequired,
        total: PropTypes.array.isRequired
    }),
     /** Usado para definir um objeto com as montagens selecionadas (String) e todos (Array[*2]). EX: {selecionadas: 'M', total: [['S', 'SUFARCGEM'], ['M', 'MONTAGEM']]} */
     montagem: PropTypes.shape({
        selecionadas: PropTypes.string.isRequired,
        total: PropTypes.array.isRequired
    }),
    /** Usado para definir um objeto para as grifes selecionadas (String) e todos (Array[*2]). EX: {selecionadas: 'AHIC', total: [['AHIC', 'AHIC'], ['RBAN', 'RBAN']]} */
    grifes: PropTypes.shape({
        selecionadas: PropTypes.string.isRequired,
        total: PropTypes.array.isRequired,
    }),
    /** Usado para definir um objeto para os fornecedores selecionadas (String) e todos (Array[*2]). EX: {selecionadas: 'LUXOTTICA', total: [['LUXOTTICA', 'LUXOTTICA'], ['G.O', 'G.O']]} */
    fornecedores: PropTypes.shape({
        selecionadas: PropTypes.string.isRequired,
        total: PropTypes.array.isRequired,
    }),
    /** Usado para informar quais os caixas pré-selecionados */
    caixas: PropTypes.string,
    /** Recebe os valores escolhidos no onchange de cada campo sendo repassado o indice do campo sendo monitorado. (EX: onChange(Array(valor), 0)) */
    onChange: PropTypes.func,
    /** Define a data default, no formato AAAA-MM-DD. USADO EM FORMULARIO COM 4 CAMPOS DATA */
    de_venc: PropTypes.string,
    /** Define a data default, no formato AAAA-MM-DD. USADO EM FORMULARIO COM 4 CAMPOS DATA */
    ate_venc: PropTypes.string,
    /** Define a data default, no formato padrão AAAA-MM-DD */
    de: PropTypes.string.isRequired,
    /** Define a data default, no formato padrão AAAA-MM-DD */
    ate: PropTypes.string.isRequired,
    /** Define o ano inicial para criação do formulário padrão AAAA. O ano do campo vai ser do enviado até o atual. */
    anoDe: PropTypes.string,
    /** Em um modelo de formulario que use um ano secundário pode-se passar seu valor aqui no padrão AAAA. . */
    anoAte: PropTypes.string,
    /** Define o mês que fica pré-selecionado para ser o mês até. O mês deve ser informado como MM */
    mes: PropTypes.string,
    /** Função de callback executada após os campos serem validados no frontend. Ela vai receber o parametro obj que é uma representação do objeto. EX: (obj)=> {} */
    fnPre: PropTypes.func,
    /** Função de callback executada após o retorno do servidor. Ela vai receber o parametro data e obj que são os dados e o objeto de campos escolhidos do formulario. EX (data, obj)=> {} */
    fnPos: PropTypes.func.isRequired,
    /** Função de callback executada quando algum erro é retornado. Recebe o parametro err. EX (err)=> {} */
    fnErr: PropTypes.func,
    /** Função de callback que permite ao usuário alterar o objeto que será enviado ao post, sendo assim é possivel remover ou incluir campos que não estão no formulário como alterar seu modelo, espera receber o retorno do objeto. EX: (obj)=>{obj.de = 'ANO_PASSADO'; return obj} */
    fnPoli: PropTypes.func,
    /** A rota que será entregue para o servidor realizar o envio dos dados */
    rota: PropTypes.string,
    /** Um boleano que define se o formulário já vai sair enviando a primeira solicitação ou não */
    autoEnvio: PropTypes.bool,
    /** Um objeto que pode conter rótulos para os campos de seleção */
    rotulos: PropTypes.shape({
        lojas: PropTypes.string,
        de: PropTypes.string,
        ate: PropTypes.string,
        anoDe: PropTypes.string,
        anoAte: PropTypes.string,
        ateOMes: PropTypes.string,
        arOc: PropTypes.string,
    })
}

export default PadraoFormLojas;