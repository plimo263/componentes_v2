import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import '../css/PadraoForm.css';
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
- Formulário com seleção multipla de valores para grupos e lojas com campo data padrão.
- Pode trabalhar no tipo grupos (padrão), lojas (sem o campo de grupos) grupos_lojas (modelo de 4 digitos) entre outros.
- Funcoes de callback podem ser repassadas para antes e depois dos dados serem submetidos assim como em casos de erro.
- Permite uma submissão automática antes mesmo do usuário clicar para solicitar os dados
 */



class PadraoForm extends React.Component {
    componentDidMount(){
        if(this.props.autoEnvio ) this._enviar();
    }
    constructor(props){
        super(props);
        let {grupos, lojas, grifes, fornecedores} = this.props;
        this.state = {
            de: this.props.de,
            ate: this.props.ate
        };
        // Os selecionados
        let grSelect, grifesSelect, fornecedoresSelect;
        switch(this.props.tipo){                
            case 'grupos_lojas': // Inicializa os estados para grupos_lojas                
               //
               this.state.lojas = this._initGrupoLoja();
               break;
            case 'grupos_lojas_ate_mes_ano': // Inicializa os estados para  grupos, lojas e os meses com o ano
                //
                this.state.lojas = this._initGrupoLoja();
                this.state.mes = this._initMes();
                this.state.anoDe = this._initAno(this.props.anoDe);
                break;
            case 'grupos_lojas_meses_entre_anos': // Inicializa os estados para lojas mes anoDe e anoAte
                //
                this.state.lojas = this._initGrupoLoja();
                this.state.mes = this._initMes(true); // Informa que vamos usar o modelo de campos multiplos
                this.state.anoDe = this._initAno(this.props.anoDe);
                this.state.anoAte = this._initAno(this.props.anoAte);
                break;
            case 'de_e_ate': // Inicializa nada
                break;
            case 'grupos_ar_oc': // Inicializa somente os grupos e formata os tipos AR/OC enviados
                grSelect = this._obterDefault(grupos.selecionadas, grupos.total);
                this.state.grupos = {total: this._formatar(grupos.total, true), selecionadas: grSelect};
                this.state.arOc = {total: this._formatar(this.props.tipos, true), selecionadas: this._obterDefault(this.props.tipos[0][0], this.props.tipos) };
                break;
            case 'grupos_grifes_ar_oc': // Inicializa grupos, grifes e ar/oc
                grSelect = this._obterDefault(grupos.selecionadas, grupos.total);
                this.state.grupos = {total: this._formatar(grupos.total, true), selecionadas: grSelect};
                this.state.arOc = {total: this._formatar(this.props.tipos, true), selecionadas: this._obterDefault(this.props.tipos[0][0],this.props.tipos) };
                grifesSelect = this._obterDefault(grifes.selecionadas, grifes.total);
                this.state.grifes = {total: this._formatar(grifes.total, true), selecionadas: grifesSelect};
                break;
            case 'ar_oc_fornecedores_grifes': // Inicializa o formulario com ar/oc, fornecedores e grifes
                this.state.arOc = {total: this._formatar(this.props.tipos, true), selecionadas: this._obterDefault(this.props.tipos[0][0],this.props.tipos) };
                
                fornecedoresSelect = this._obterDefault(fornecedores.selecionadas, fornecedores.total);
                this.state.fornecedores = {total: this._formatar(fornecedores.total, true), selecionadas: fornecedoresSelect};

                grifesSelect = this._obterDefault(grifes.selecionadas, grifes.total);
                this.state.grifes = {total: this._formatar(grifes.total, true), selecionadas: grifesSelect};
                break;
            case 'grupos_lojas_ano': // Inicializa os estados para grupos_lojas e os anos
               //
               this.state.lojas = this._initGrupoLoja();
               this.state.anoDe = this._initAno(this.props.anoDe);
               break;
            case 'grupos_lojas_de_ate_de_venc_ate_venc': // Formulario com 4 campos de data e grupos_lojas
                this.state.lojas = this._initGrupoLoja();
                this.state.de_venc = this.props.de_venc;
                this.state.ate_venc = this.props.ate_venc;
                break;
            case 'padrao_grifes_tipos': // Formulario com grupos, lojas e grifes com tipos
                // grupos selecionados
                grSelect = this._obterDefault(grupos.selecionadas, grupos.total);
                this.state.grupos = {total: this._formatar(grupos.total, true) , selecionadas: grSelect};
                // Lojas selecionadas
                this.state.lojas = {total: this._formatar(lojas.total, true), selecionadas: this._obterDefault(lojas.selecionadas, lojas.total)};
                grifesSelect = this._obterDefault(grifes.selecionadas, grifes.total);
                this.state.grifes = {total: this._formatar(grifes.total, true), selecionadas: grifesSelect};
                this.state.arOc = {total: this._formatar(this.props.tipos, true), selecionadas: this._obterDefault(this.props.tipos[0][0],this.props.tipos) };
                break;
            case 'padrao_tipos': // Formulario para grupos,lojas com os tipos
                // grupos selecionados
                grSelect = this._obterDefault(grupos.selecionadas, grupos.total);
                this.state.grupos = {total: this._formatar(grupos.total, true) , selecionadas: grSelect};
                // Lojas selecionadas
                this.state.lojas = {total: this._formatar(lojas.total, true), selecionadas: this._obterDefault(lojas.selecionadas, lojas.total)};
                this.state.arOc = {total: this._formatar(this.props.tipos, true), selecionadas: this._obterDefault(this.props.tipos[0][0],this.props.tipos) };
                break;
            case 'padrao_sem_de_ate': // Inicializa o formulario de grupos e lojas sem de e ate
            default:                
                // grupos selecionados
                grSelect = this._obterDefault(grupos.selecionadas, grupos.total);
                this.state.grupos = {total: this._formatar(grupos.total, true) , selecionadas: grSelect};
                // Lojas selecionadas
                this.state.lojas = {total: this._formatar(lojas.total, true), selecionadas: this._obterDefault(lojas.selecionadas, lojas.total)};
                break;
            

        }
        this._refs = [React.createRef(), React.createRef()];
        this._refs_de_venc = React.createRef();
        this._refs_ate_venc = React.createRef();
    }

    _renderPadrao(semLoja){
        let {grupos, lojas} = this.state;
        let {rotulos} = this.props;
        let arr = [
                <label htmlFor="grupos">
                    <span><i className="material-icons">store</i> <i>{rotulos.grupos}:</i></span>
                    <Select styles={{menu: (provided, state)=>({...provided, 'zIndex': '999'})} } isDisabled={this.state.aguardar} onChange={(e)=> this._onChange('grupos', e, 0)} 
                            components={animetedComponents} value={grupos.selecionadas} isMulti 
                            options={grupos.total} />
                </label>];
        if(semLoja) return arr;
        // Entao deve ser exibido tambem o campo lojas
        return arr.concat(
            <label htmlFor="lojas">
                <span><i className="material-icons">home</i> <i>{rotulos.lojas}:</i></span>
                <Select styles={{menu: (provided, state)=>({...provided, 'zIndex': '999'})} } isDisabled={this.state.aguardar} onChange={(e)=> this._onChange('lojas', e, 1)} 
                        components={animetedComponents} value={lojas.selecionadas} isMulti 
                        options={lojas.total} />
            </label>);
    }
    // Retorna o campo de/ate
    _renderDeAte(idx){
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
        let {rotulos} = this.props;
        let {lojas} = this.state;
        return [<label htmlFor="lojas">
                    <span><i className="material-icons">home</i> <i>{rotulos.lojas}:</i></span>
                    <Select styles={{menu: (provided, state)=>({...provided, 'zIndex': '999'})} } isDisabled={this.state.aguardar} onChange={(e)=> this._onChange('lojas', e, 0)} 
                            components={animetedComponents} value={lojas.selecionadas} isMulti 
                            options={lojas.total} />
                </label>]
    }
    // Renderiza o campo lojas mas para o grupos_lojas
    _renderGruposLojas(){
        let {lojas} = this.state;
        let {rotulos} = this.props;
        return [<label htmlFor="lojas">
                    <span><i className="material-icons">home</i> <i>{rotulos.lojas}:</i></span>
                    <Select styles={{menu: (provided, state)=>({...provided, 'zIndex': '999'})} } isDisabled={this.state.aguardar} onChange={(e)=> this._onChange('lojas', e, 0)} 
                            components={animetedComponents} value={lojas.selecionadas} isMulti 
                            options={lojas.total} />
                </label>]
    }
    // Renderiza o campo grupos somente com os grupos
    _renderGrupos(){
        return [this._renderPadrao(true)[0]]; // Retorna somente o campo dos grupos
    }
    // Renderiza o campo AR,OC
    _renderArOc(idx){
        let {arOc} = this.state;
        let {rotulos} = this.props;
        return [
                <label htmlFor="ar_oc">
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
                <label htmlFor="ar_oc">
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
        return [
                <label htmlFor="ar_oc">
                    <span><i className="material-icons">local_shipping</i> <i>{rotulos.fornecedores}:</i></span>
                    <Select styles={{menu: (provided, state)=>({...provided, 'zIndex': '999'})} } isDisabled={this.state.aguardar} onChange={(e)=> this._onChange('fornecedores', e, idx)} 
                            components={animetedComponents} value={fornecedores.selecionadas} isMulti 
                            options={fornecedores.total} />
                </label>]
    }

    render(){
        // Renderiza baseado no tipo
        let {tipo} = this.props;
        let {erro} = this.state;
        // Switch para ver qual grupo selecionado
        let renderizar;
        switch(tipo){
            case 'grupos_lojas':
                renderizar = this._renderGruposLojas().concat(this._renderDeAte(0));
                break;
            case 'grupos_lojas_ate_mes_ano': //
                renderizar = this._renderGruposLojas().concat(this._renderAteOMes(0)).concat(this._renderAno(this.state.anoDe, 1, 'anoDe', this.props.rotulos.anoDe));
                break;
            case 'grupos_lojas_meses_entre_anos': // Renderiza com o campo até o mes sendo de multipla escolha
                renderizar = this._renderGruposLojas().concat(this._renderAteOMes(0, true)).concat(
                    this._renderAno(this.state.anoDe, 1, 'anoDe', this.props.rotulos.anoDe)
                    ).concat(this._renderAno(this.state.anoAte, 2, 'anoAte', this.props.rotulos.anoAte));
                break;
            case 'de_e_ate': // Renderiza somente os campos de e ate
                renderizar = this._renderDeAte(0);
                break;
            case 'grupos_ar_oc': // Renderiza os grupos e ar_oc
                renderizar = this._renderGrupos().concat(this._renderArOc(1));
                break;
            case 'padrao_sem_de_ate': // Rendeiza sem os campos de e ate
                renderizar = this._renderPadrao();
                break;
            case 'grupos_grifes_ar_oc': // Renderiza os grupos com as grifes e ar_oc
                renderizar = this._renderGrupos().concat(this._renderGrifes(1)).concat(this._renderArOc(2));
                break;
            case 'ar_oc_fornecedores_grifes': // Renderiza o tipos, fornecedores e grifes
                renderizar = this._renderGrifes(0).concat(this._renderArOc(1)).concat(this._renderFornecedores(2));
                break;
            case 'grupos_lojas_ano': // Renderiza lojas e ano
                renderizar = this._renderGruposLojas().concat(
                    this._renderAno(this.state.anoDe, 1, 'anoDe', this.props.rotulos.anoDe)
                );
                break;
            case 'grupos_lojas_de_ate_de_venc_ate_venc': // Renderiza os grupos_lojas com 4 datas
                renderizar = this._renderGruposLojas().concat(this._renderDeAte(1)).concat(this._renderDeAteVenc(2));
                break;
            case 'padrao_grifes_tipos': // Renderiza os grupos, lojas, grifes e tipos
                renderizar = this._renderPadrao().concat(this._renderGrifes(1)).concat(this._renderArOc(2));
                break;
            case 'padrao_tipos': // Renderiza os grupos, lojas e tipos
                renderizar = this._renderPadrao().concat(this._renderArOc(1));
                break;
            default:
                renderizar = this._renderPadrao().concat(this._renderDeAte(1));
                break;
        }
        return <div  className="PadraoForm">
                    <div ref={this._refs[2]} className="form-geral">
                        {renderizar}
                        <Botao disabled={this.state.aguardar} onClick={this._enviar.bind(this)}>{this.state.aguardar ? <Carregar mensagem='AGUARDE' /> :'PESQUISAR'}</Botao>                
                    </div>
                    <Fade>{erro ? this._erro() : null}</Fade>
            </div>;
    }

    // Retorna o objeto para as lojas que atendam a uma concatenacao de grupo/loja
    _initGrupoLoja(){
        let {grupos, lojas} = this.props;

        let grFL, grFLSelec, grFlDefault; 
        // Convertendo os grupos e obtendo o default
        grFL = this.getGrupoFil(grupos.total, lojas.total); // ["0101", "0102"]
        grFLSelec = this.getGrupoFil(grupos.selecionadas.split(','), lojas.selecionadas.split(','));
        // Agora tirando os selecionados e incluindo nas lojas
        grFlDefault = this._obterDefault(grFLSelec.map(ele=> ele[0]).join(','), grFL);
        
        return {total: this._formatar(grFL.map(ele=> ele[0]), true), selecionadas: grFlDefault};
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


    // Retorna o campo de selecao dos meses recebendo o default como sendo até o mes
    _renderAteOMes(idx, multiplo){
        let {mes} = this.state;
        return [<label htmlFor="ate_o_mes">
                    <span><i className="material-icons">calendar_today</i> <i>{this.props.rotulos.ateOMes}:</i></span>
                    <Select styles={{menu: (provided, state)=>({...provided, 'zIndex': '999'})} } isDisabled={this.state.aguardar} onChange={(e)=> this._onChange('mes', e, idx+1)} 
                            components={animetedComponents} value={mes.selecionadas}  isMulti={multiplo}
                            options={mes.total} />
                </label>]
    }
    // Retorna o campo de selecao dos anos
    _renderAno(obj, idx, tipoAno, rotulo){
        
        return [<label htmlFor={tipoAno}>
                    <span><i className="material-icons">calendar_today</i> <i>{rotulo}:</i></span>
                    <Select styles={{menu: (provided, state)=>({...provided, 'zIndex': '999'})} } isDisabled={this.state.aguardar} onChange={(e)=> this._onChange(tipoAno, e, idx+1)} 
                            components={animetedComponents} value={obj.selecionadas}  
                            options={obj.total} />
                </label>]
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
    // Metodo de envio personalizado para padrao
    _enviarPadrao(){
        // Verifica se os campos estão ok
        let {grupos, lojas} = this.state;
        let obj = {de: null, ate: null};
        obj.de = ReactDOM.findDOMNode(this._refs[0].current).value;
        obj.ate = ReactDOM.findDOMNode(this._refs[1].current).value;
        // Se o tipo for padrao devemos conferir este campo
        if(this.props.tipo === 'padrao'){
            // Veja se tem os campos gruposSelecionadas e lojasSelecionadas
            if(!grupos || !Array.isArray(grupos.selecionadas) || grupos.selecionadas.length === 0){ 
                this.setState({erro: 'FAVOR ESCOLHER UM GRUPO PARA O FILTRO'});
                return false;
            }
            // Vamos extrair o valor de cada item do array e concatenar para criar a string de valor
            obj.grupos = grupos.selecionadas.map(ele=> ele.value).join(',');
        }
                
        // Vamos ver se a loja tem valores e se é maior que 0
        if(!lojas || !Array.isArray(lojas.selecionadas) || lojas.selecionadas.length === 0){
            this.setState({erro: 'FAVOR ESCOLHER A LOJA PARA O FILTRO'});
            return false;
        }
        // Vamos extrair o valor de cada item do array e concatenar para criar a string de valor
        obj.lojas = lojas.selecionadas.map(ele=> ele.value).join(',');
        /*
        
        */
        // Se nao tiver sido preenchido uma destas datas sair fora
        if(!obj.de || !obj.ate){
            this.setState({erro: 'FAVOR PREENCHER AS DATAS CORRETAMENTE AAAA-MM-DD'});
            return false;
        }
        // Verifica as datas de/ate se uma é maior que a outra
        let datas = [obj.de, obj.ate].map(ele=> new Date(ele));
        if(datas[0] > datas[1]){
            this.setState({erro: 'A DATA DE NÃO PODE SER MAIOR QUE ATÉ'});
            return false;
        }
        return obj;
    }
    // Metodo para recuperar lojas, ateOMes e anoDe
    _enviarGruposLojasAteMesAno(){
        // Verifica se os campos estão ok
        let {lojas, anoDe, mes} = this.state;
        let obj = {de: anoDe.selecionadas.value, ateOMes: mes.selecionadas.value};
                       
        // Vamos ver se a loja tem valores e se é maior que 0
        if(!lojas || !Array.isArray(lojas.selecionadas) || lojas.selecionadas.length === 0){
            this.setState({erro: 'FAVOR ESCOLHER A LOJA PARA O FILTRO'});
            return false;
        }
        // Vamos extrair o valor de cada item do array e concatenar para criar a string de valor
        obj.lojas = lojas.selecionadas.map(ele=> ele.value).join(',');
        
        // Necessario fazer um passo adicional aqui, caso seja grupos_lojas deve-se dividir as lojas
        let divididos = this.divGrupoFil(obj.lojas);
        obj.grupos = divididos[0];
        obj.lojas = divididos[1];
          
        return obj;
    }
    // Metodo para recuperar grupos_lojas
    _enviarGrupoLojas(){
        // Verifica se os campos estão ok
        let {lojas} = this.state;
        let obj = {de: null, ate: null};
        obj.de = ReactDOM.findDOMNode(this._refs[0].current).value;
        obj.ate = ReactDOM.findDOMNode(this._refs[1].current).value;
                                
        // Vamos ver se a loja tem valores e se é maior que 0
        if(!lojas || !Array.isArray(lojas.selecionadas) || lojas.selecionadas.length === 0){
            this.setState({erro: 'FAVOR ESCOLHER A LOJA PARA O FILTRO'});
            return false;
        }
        // Vamos extrair o valor de cada item do array e concatenar para criar a string de valor
        obj.lojas = lojas.selecionadas.map(ele=> ele.value).join(',');
        /*
        
        */
        // Se nao tiver sido preenchido uma destas datas sair fora
        if(!obj.de || !obj.ate){
            this.setState({erro: 'FAVOR PREENCHER AS DATAS CORRETAMENTE AAAA-MM-DD'});
            return false;
        }
        // Verifica as datas de/ate se uma é maior que a outra
        let datas = [obj.de, obj.ate].map(ele=> new Date(ele));
        if(datas[0] > datas[1]){
            this.setState({erro: 'A DATA DE NÃO PODE SER MAIOR QUE ATÉ'});
            return false;
        }
        // Necessario fazer um passo adicional aqui, caso seja grupos_lojas deve-se dividir as lojas
        let divididos = this.divGrupoFil(obj.lojas);
        obj.grupos = divididos[0];
        obj.lojas = divididos[1];
        return obj; 
    }
    // Metodo para recuperar grupos_lojas a selecao de meses e os anos de/ate
    _enviarGrupoLojasMesesEntreAnos(){
        // Verifica se os campos estão ok
        let {lojas, mes, anoDe, anoAte} = this.state;
        let obj = {de: anoDe.selecionadas.value, ate: anoAte.selecionadas.value};
                                        
        // Vamos ver se a loja tem valores e se é maior que 0
        if(!lojas || !Array.isArray(lojas.selecionadas) || lojas.selecionadas.length === 0){
            this.setState({erro: 'FAVOR ESCOLHER A LOJA PARA O FILTRO'});
            return false;
        }
        // Vamos extrair o valor de cada item do array e concatenar para criar a string de valor
        obj.lojas = lojas.selecionadas.map(ele=> ele.value).join(',');
        /*
        
        */
        //Selecionou algum mês ?
        if(!mes || (!Array.isArray(mes.selecionadas)) || mes.selecionadas.length === 0){
            this.setState({erro: 'FAVOR INFORMAR UM MÊS QUE DESEJA PARA O FILTRO'});
            return false;
        }
        obj.mes = mes.selecionadas.map(ele=> ele.value).join(',');
        // Veja se o anoDe é maior que o anoAte
        if(parseInt(obj.de) > parseInt(obj.ate)){
            this.setState({erro: 'O ANO DE NÃO DEVE SER MAIOR QUE O ANO ATÉ'})
            return false;
        }
        // Necessario fazer um passo adicional aqui, caso seja grupos_lojas deve-se dividir as lojas
        let divididos = this.divGrupoFil(obj.lojas);
        obj.grupos = divididos[0];
        obj.lojas = divididos[1];
        return obj; 
    }
    // Metodo que valida as lojas e o ano
    _enviarLojasAno(){
        // Verifica se os campos estão ok
        let {lojas, anoDe} = this.state;
        let obj = {de: anoDe.selecionadas.value};
                                        
        // Vamos ver se a loja tem valores e se é maior que 0
        if(!lojas || !Array.isArray(lojas.selecionadas) || lojas.selecionadas.length === 0){
            this.setState({erro: 'FAVOR ESCOLHER A LOJA PARA O FILTRO'});
            return false;
        }
        // Vamos extrair o valor de cada item do array e concatenar para criar a string de valor
        obj.lojas = lojas.selecionadas.map(ele=> ele.value).join(',');
        
        // Veja se o anoDe é maior que o anoAte
        let reg = /^([1-2][0-9]{3})$/g;
        if(obj.de.toString().search(reg) === -1){
            this.setState({erro: 'O ANO DEVE SER UM NUMERO E ATENDER O PADRAO AAAA'});
            return false;
        }
        
        return obj; 
    }
    // Metodo para recuperar grupos_lojas a selecao de meses e os anos de/ate
    _enviarGruposLojasAno(){
        // Verifica se os campos estão ok
        let {lojas, anoDe} = this.state;
        let obj = {de: anoDe.selecionadas.value};
                                        
        // Vamos ver se a loja tem valores e se é maior que 0
        if(!lojas || !Array.isArray(lojas.selecionadas) || lojas.selecionadas.length === 0){
            this.setState({erro: 'FAVOR ESCOLHER A LOJA PARA O FILTRO'});
            return false;
        }
        // Vamos extrair o valor de cada item do array e concatenar para criar a string de valor
        obj.lojas = lojas.selecionadas.map(ele=> ele.value).join(',');
        
        // Veja se o anoDe é maior que o anoAte
        let reg = /^([1-2][0-9]{3})$/g;
        if(obj.de.toString().search(reg) === -1){
            this.setState({erro: 'O ANO DEVE SER UM NUMERO E ATENDER O PADRAO AAAA'});
            return false;
        }
        // Necessario fazer um passo adicional aqui, caso seja grupos_lojas deve-se dividir as lojas
        let divididos = this.divGrupoFil(obj.lojas);
        obj.grupos = divididos[0];
        obj.lojas = divididos[1];
        return obj; 
    }
    // Valida o formulario de 4 campos, de,ate, devenc e atevenc
    _enviarGruposLojasDeAteDeAteVenc(){
        // Verifica se os campos estão ok
        let {lojas} = this.state;
        let obj = {de: null, ate: null, de_venc: null, ate_venc: null};
        
        obj.de = ReactDOM.findDOMNode(this._refs[0].current).value;
        obj.ate = ReactDOM.findDOMNode(this._refs[1].current).value;

        obj.de_venc = ReactDOM.findDOMNode(this._refs_de_venc.current).value;
        obj.ate_venc = ReactDOM.findDOMNode(this._refs_ate_venc.current).value;
                                        
        // Vamos ver se a loja tem valores e se é maior que 0
        if(!lojas || !Array.isArray(lojas.selecionadas) || lojas.selecionadas.length === 0){
            this.setState({erro: 'FAVOR ESCOLHER A LOJA PARA O FILTRO'});
            return false;
        }
        // Vamos extrair o valor de cada item do array e concatenar para criar a string de valor
        obj.lojas = lojas.selecionadas.map(ele=> ele.value).join(',');
        
        // Se nao tiver sido preenchido uma destas datas sair fora
        if(!obj.de || !obj.ate){
            this.setState({erro: 'FAVOR PREENCHER AS DATAS DE E ATE CORRETAMENTE AAAA-MM-DD'});
            return false;
        }
        // Verifica as datas de/ate se uma é maior que a outra
        let datas = [obj.de, obj.ate].map(ele=> new Date(ele));
        if(datas[0] > datas[1]){
            this.setState({erro: 'A DATA DE NÃO PODE SER MAIOR QUE ATÉ'});
            return false;
        }
        
        //
        if(!obj.de_venc || !obj.ate_venc){
            this.setState({erro: 'FAVOR PREENCHER AS DATAS DE E ATE CORRETAMENTE AAAA-MM-DD'});
            return false;
        }
        // Verifica as datas de_venc/ate se uma é maior que a outra
        datas = [obj.de_venc, obj.ate_venc].map(ele=> new Date(ele));
        if(datas[0] > datas[1]){
            this.setState({erro: 'A DATA DE NÃO PODE SER MAIOR QUE ATÉ'});
            return false;
        }

        // Necessario fazer um passo adicional aqui, caso seja grupos_lojas deve-se dividir as lojas
        let divididos = this.divGrupoFil(obj.lojas);
        obj.grupos = divididos[0];
        obj.lojas = divididos[1];
        return obj; 
    }
    /*
        UMA GRANDE QUANTIDADE DE CAMPOS PARA SEREM VALIDADOS
    */
    // Metodo de validacao do tipo
    _validarArOc(){
        let {arOc} = this.state;
        // Verifica se foi escolhido algum
        if(!arOc || !Array.isArray(arOc.selecionadas) || arOc.selecionadas.length < 1){
            this.setState({erro: 'FAVOR PREENCHER O TIPO COMO AR OU OC'});
            return false;
        }
        // Validado retorna o selecionado
        return {tipo_ar_oc: arOc.selecionadas.map(ele=> ele.value).join(',')}
    }
    // Metodo para validacao de grupos
    _validarGrupos(){
        // Verifica se os grupos foram selecionados
        let {grupos} = this.state;
        // Veja se tem os campos gruposSelecionadas
        if(!grupos || !Array.isArray(grupos.selecionadas) || grupos.selecionadas.length === 0){ 
            this.setState({erro: 'FAVOR ESCOLHER UM GRUPO PARA O FILTRO'});
            return false;
        }
        // Vamos extrair o valor de cada item do array e concatenar para criar a string de valor
        return {grupos: grupos.selecionadas.map(ele=> ele.value).join(',')};
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
        return {grife: grifes.selecionadas.map(ele=> ele.value).join(',')}
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
       if(!mes || (!mes.hasOwnProperty('selecionadas') )){
           this.setState({erro: 'FAVOR INFORMAR UM MÊS QUE DESEJA PARA O FILTRO'});
           return false;
       }
       return {mes: mes.selecionadas.value };
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

    // Fazer a conferencia dos campos e enviar os dados
    _enviar(){
        let obj, objArOc, objGrifes, objLojas, objFornecedores;
        switch(this.props.tipo){
            case 'grupos_lojas':
                obj = this._enviarGrupoLojas();
                break;
            default:
                obj = this._enviarPadrao();
                break;
            case 'grupos_lojas_ate_mes_ano':
                obj = this._enviarGruposLojasAteMesAno(); // Recupera os grupos/lojas até o mes e anoDe
                break;
            case 'grupos_lojas_meses_entre_anos':  // Recupera o objeto com os campos gurpos/lojas mes e anoDe e anoAte
                obj = this._enviarGrupoLojasMesesEntreAnos();
                break;
            case 'de_e_ate': // Valida os campos de e ate e prossegue
                obj = {};
                obj.de = ReactDOM.findDOMNode(this._refs[0].current).value;
                obj.ate = ReactDOM.findDOMNode(this._refs[1].current).value;
                // Se nao tiver sido preenchido uma destas datas sair fora
                if(!obj.de || !obj.ate){
                    this.setState({erro: 'FAVOR PREENCHER AS DATAS CORRETAMENTE AAAA-MM-DD'});
                    obj = false;
                }
                //
                // Verifica as datas de/ate se uma é maior que a outra
                let datas = [obj.de, obj.ate].map(ele=> new Date(ele));
                if(datas[0] > datas[1]){
                    this.setState({erro: 'A DATA DE NÃO PODE SER MAIOR QUE ATÉ'});
                    obj = false;
                }
                break;
            case 'grupos_ar_oc': // Valida um formulario com campos AR/OC E GRUPOS
                obj = this._validarGrupos();
                if(!obj) return false; // Grupo nao validado
                objArOc = this._validarArOc();
                if(!objArOc){ obj = false; return false;}
                obj = Object.assign(obj, objArOc);
                break;
            case 'padrao_sem_de_ate': // Valida somente os campos de grupos e lojas
                obj = this._validarGrupos();
                if(!obj) return false; // Grupo nao validado
                objLojas = this._validarLojas();
                if(!objLojas){obj = objLojas; return false;} // Loja nao validado
                obj = Object.assign(obj, objLojas);
                break;
            case 'grupos_grifes_ar_oc': // Valida os grupos, grifes ar/oc
                obj = this._validarGrupos();
                if(!obj) return false; // Grupo nao validado

                objArOc = this._validarArOc();
                if(!objArOc){ obj = false; return false;}

                obj = Object.assign(obj, objArOc);
                // Valida grifes
                objGrifes = this._validarGrifes();
                if(!objGrifes){obj = false; return false;}

                obj = Object.assign(obj, objGrifes);
                break;
            case 'ar_oc_fornecedores_grifes': // Valida os campos de ar/oc grifes e fornecedores
                objArOc = this._validarArOc();
                if(!objArOc){ obj = false; return false;}

                obj = objArOc;
                // Valida grifes
                objGrifes = this._validarGrifes();
                if(!objGrifes){obj = false; return false;}

                obj = Object.assign(obj, objGrifes);
                // Valida os fornecedores
                objFornecedores = this._validarFornecedores();
                if(!objFornecedores){obj = false; return false;}

                obj = Object.assign(obj, objFornecedores);
                break;
            case 'padrao_grifes_tipos':
                obj = this._validarGrupos();
                if(!obj) return false; // Grupo nao validado
                objLojas = this._validarLojas();
                if(!objLojas){obj = objLojas; return false;} // Loja nao validado
                obj = Object.assign(obj, objLojas);
                //
                objArOc = this._validarArOc();
                if(!objArOc){ obj = false; return false;}

                obj = Object.assign(obj, objArOc);
                // Valida grifes
                objGrifes = this._validarGrifes();
                if(!objGrifes){obj = false; return false;}

                obj = Object.assign(obj, objGrifes);
                break;
            case 'padrao_tipos': // valida grupos e lojas com os tipos
                obj = this._validarGrupos();
                if(!obj) return false; // Grupo nao validado
                objLojas = this._validarLojas();
                if(!objLojas){obj = objLojas; return false;} // Loja nao validado
                obj = Object.assign(obj, objLojas);
                //
                objArOc = this._validarArOc();
                if(!objArOc){ obj = false; return false;}

                obj = Object.assign(obj, objArOc);
                break;
            case 'grupos_lojas_ano': // Valida os campos grupos/lojas e o ano
                obj = this._enviarGruposLojasAno();
                break;
            case 'grupos_lojas_de_ate_de_venc_ate_venc': // Valida os campos com 4 datas
                obj = this._enviarGruposLojasDeAteDeAteVenc();
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
            case 'grupos':
                let {grupos} = this.state;
                if(!e){ 
                    grupos.selecionadas = [];
                    this.setState({grupos}); 
                    return false; 
                }
                // Se tiver a opção todos retornar somente o todos
                todos = e.filter(ele=> ele.label === 'TODOS');
                if(todos.length > 0){
                    grupos.selecionadas = todos;
                    this.setState({grupos})
                } else {
                    grupos.selecionadas = e;
                    this.setState({grupos});
                }
                valor = e.map(ele=> ele.value);
                break;
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

            default:
                break;
        }
        // Repassa o valor e o indice
        if(this.props.onChange) this.props.onChange(valor, idx);

    }
    // Funcao converte os grupos e lojas para uma fusao grupo/loja
    getGrupoFil(grupos, lojas){
        // Recebe um array grupos e um array lojas entao faz o casamento
        // dos grupos/lojas corretos e os retorna 
        let {grpFil} = this.props;
        let retorno = new Set(); // vai fazer a montagem dos grupos e filiais disponiveis
        grupos.forEach(gr=>{
            lojas.forEach(lj=>{
                // Junta grupo e loja e veja se existe no grpFil entao apenda no retorno
                let grLj = gr[0].toString().padStart(2, '0')+(
                    Array.isArray(lj) ? lj[0].toString().padStart(2, '0') : lj.toString().padStart(2, '0') 
                );
                if(grpFil.includes(grLj)) retorno.add([grLj])

            });
        });

        return Array.from(retorno);
    }
    // Divide o grupo/loja para um array com os grupos e lojas selecionados
    divGrupoFil(grpFil){
        // Metodo que divide o grupo e as filiais retornando um array com string grupos e string filiais
        let retorno = {
            'fil': new Set(),
            'gr': new Set() 
        };
        grpFil.split(',').forEach(ele=>{
            // Separa o grupo da filial
            let gr = ele.substring(0, 2);
            let fl = ele.substring(2, 4);
            retorno.gr.add(gr); retorno.fil.add(fl);
        });
        let arrGr = [], arrFl = [];
        retorno.gr.forEach(ele=>{ arrGr.push(ele) })
        retorno.fil.forEach(ele=>{ arrFl.push(ele) })
        return [arrGr.join(','), arrFl.join(',')]
    }

}

PadraoForm.defaultProps = {
    tipo: 'padrao',
    rota: window.location.pathname,
    de_venc: new Date().toLocaleDateString().split('/').reverse().join('-'),
    ate_venc: new Date().toLocaleDateString().split('/').reverse().join('-'),
    de: new Date().toLocaleDateString().split('/').reverse().join('-'),
    ate: new Date().toLocaleDateString().split('/').reverse().join('-'),
    anoDe: new Date().toLocaleDateString().split('/').reverse()[0],
    anoAte: new Date().toLocaleDateString().split('/').reverse()[0],
    mes: parseInt(new Date().toLocaleDateString().split('/').reverse()[1]),
    grpFil: [
        '0101', '0102', '0201', '0301', '0302', '0401', '0402',
        '0501', '0502', '0601', '0701', '0702', '0801', '0901',
        '1001', '1002', '1101', '1102', '1201', '1301', '1401',
        '1402', '1501', '1601', '1602', '1701', '1801', '1901', '2001'
        ],
    rotulos: {
        grupos: 'GRUPOS',
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
        fornecedores: 'FORNECEDORES'
    },
    tipos: [['AR','AR'], ['OC','OC']],
    grifes: {selecionadas: "AHIC", total: [['AHIC', 'AHIC'], ['RBAN', 'RBAN']]},

}

PadraoForm.propTypes = {
    /** Usado para definir o tipo de formulario a ser construido. */
    tipo: PropTypes.oneOf([
        'padrao', 'lojas', 'grupos_lojas',
        'grupos_lojas_ate_mes_ano', 'de_e_ate',
        'grupos_lojas_meses_entre_anos',
        'grupos_ar_oc', 'padrao_sem_de_ate',
        'grupos_grifes_ar_oc','lojas_mes_ano',
        'ar_oc_fornecedores_grifes',
        'grupos_lojas_ano',
        'grupos_lojas_de_ate_de_venc_ate_venc',
        'lojas_ano', 'lojas_sem_de_e_ate', 'lojas_tipos_grifes',
        'padrao_grifes_tipos', 'padrao_tipos',
        ]).isRequired,
    /** Define os tipos dos produtos se são AR, OC, LG, LC ou os 4 */
    tipos: PropTypes.arrayOf(
        PropTypes.array
    ),
    /** Define os grupos/filiais que devem ser combinados para obter o resultado esperado */
    grpFil: PropTypes.arrayOf(PropTypes.string),
    /** Usado para definir um objeto com os grupos selecionados (String) e todos (Array[*2]). EX: {selecionadas: '1', total: [[1, 'FMOREIRA'], [2, 'FB']]} */
    grupos: PropTypes.shape({
        selecionadas: PropTypes.string.isRequired,
        total: PropTypes.array.isRequired
    }),
    /** Usado para definir um objeto com as lojas selecionadas (String) e todos (Array[*2]). EX: {selecionadas: '1,2', total: [[1, '01'], [2, '02']]} */
    lojas: PropTypes.shape({
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
        grupos: PropTypes.string,
        lojas: PropTypes.string,
        de: PropTypes.string,
        ate: PropTypes.string,
        anoDe: PropTypes.string,
        anoAte: PropTypes.string,
        ateOMes: PropTypes.string,
        arOc: PropTypes.string,
    })
}

export default PadraoForm;