import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import validator from 'validator';
import Botao from './botao';
import Carregar from './carregar';
import Sugestao from './sugestao';
import Toggle from './toggle';
import '../css/Toggle.css';
import $ from 'jquery';
import 'jquery-mask-plugin';
import '../css/EntradaForm.css';
import Fade from './fade';
import '../css/Transicoes.css';

class EntradaForm extends React.Component {

    constructor(props){
        super(props);
        this._arrayRef = []; // Gera as referencias para retornarmos quando getValues for chamado
    }

    static defaultProps = {
        className: '',
        aguardar: false,
        style: {},
        classNameBotao: '',
        erro: null,
        modo: 'padrao',
    }
    //
    render(){
        let {somenteLeitura, className, style, onSubmit, schema} = this.props;
        className = classNames('EntradaForm '+className, {
            'entrada-form-vertical': this.props.modo === 'mobile'
        });

        return (
            <form 
                style={style} className={className} 
                onSubmit={onSubmit.bind(this)}
            >
                { /* VAI EM CADA SCHEMA E DETERMINA AS REFERENCIAS, 
                     DEPOIS ENVIA PARA O RENDERINPUT CRIAR O CAMPO
                  */
                    schema.map((ele,idx)=>{
                        this._arrayRef[idx] = React.createRef();
                        // Faz um copia para que alteracoes na props nao afete o schema principal
                        // Necessario passar o opt separado para que o mesmo possa funcionar
                        return this._renderInput(ele, idx, ele.opt);
                    })
                }
                {this._renderEsqueciSenha()}
                {this._renderWarning()}
                {!somenteLeitura ? this._renderBotao() : null}
            </form>
        )
    }
    // Renderiza a opção EsqueciASenha (desativada)
    _renderEsqueciSenha(){
        return <p className='text-right'></p>
        /*
        return <p className='text-right'>
                {this.props.esqueciASenha ? 
                    <a onClick={this.props.esqueciASenha} 
                        href='#esquecia-a-senha'>ESQUECI A SENHA</a>: 
                    null
                }
               </p>;
        */
    }
    // Renderiza o botão de envio
    _renderBotao(){
        let {classNameBotao, aguardar} = this.props;
        classNameBotao = classNames('btn btn-outline-danger', classNameBotao);
        // Se estiver aguardando inserir o botão carregar
        let msg = aguardar ? <Carregar /> : 'ENVIAR';
        return <Botao className={classNameBotao} disabled={aguardar}>{msg}</Botao>
    }
    //
    _renderWarning(){
        let {erro} = this.props;

        return <Fade>{erro ? <p key='erro' className="text-danger text-center small">
                                <i className="material-icons">warning</i> {erro}
                            </p> : null}</Fade>
    }
    // Renderiza os campos baseado no objeto recebido
    _renderInput(obj, idRef, opt){
        // EXTRAINDO AS PRINCIPAIS PROPRIEDADES DO OBJETO
        const {type, label, icon} = obj;
                
        //delete obj.opt; // Excluindo o opt do objeto
        // Sem um tipo, retorna null
        if(!type || validator.isEmpty(type)) return null;
        // Extraindo o restante dos atributos
        let {defaultValue, onChange, disabled, className, required, multiple} = obj;

        let classes = classNames('form-control', className);
        disabled = this.props.aguardar || this.props.somenteLeitura ? true : disabled; // Se tiver aguardando o disabled deve ser true
        // Veja se o tipo e customizado, se for simplesmente aplique o seu children
        if(type === 'custom'){
            return obj.children
        } else if(type === 'sugestao' && Array.isArray(obj.itens) && obj.itens.length > 0){
            let conteudo = <Sugestao 
                                className={classes}  itens={obj.itens}
                                defaultValue={defaultValue} ref={this._arrayRef[idRef]} 
                                onChange={onChange} disabled={disabled} required={required} 
                                multiple={multiple} />;
            // PARA Sugestao aplicamos o estilo de imediato
            return  <label 
                        htmlFor={idRef.toString()} 
                        className={className} 
                        key={idRef}>
                        {icon ? <i className="material-icons">{icon}</i>: null} {label}
                        {conteudo}
                    </label>
        } else if(type === 'select' && Array.isArray(obj.itens) && obj.itens.length > 0 ){
            // Vamos ver se o tipo é um 'select', se for ele precisa conter um array ou um array aninhado
            let estruturaInterna = obj.itens.map((item,itemidx)=>{
                let key, value;
                // Se for um array aninhado atribui os valores (valor, descricao)
                if(Array.isArray(item) && item.length === 2){ key = item[0];value = item[1]; } 
                else { key = item; value = item; }
                return <option key={itemidx} value={key}>{value}</option>
            });
            let conteudo = <select className={classes} 
                                defaultValue={defaultValue} ref={this._arrayRef[idRef]} 
                                onChange={onChange} disabled={disabled} required={required} 
                                multiple={multiple}>
                                {estruturaInterna}
                            </select>;
            
            return  <label htmlFor={idRef.toString()} 
                        className={className} key={idRef}
                    >
                       {icon ? <i className="material-icons">{icon}</i>: null} {label}
                        {conteudo}
                    </label>
        } else if(type === 'textarea'){
            return <label 
                        htmlFor={idRef.toString()} className={className} key={idRef}
                    >
                      {icon ? <i className="material-icons">{icon}</i>: null} {label}
                      <textarea name={idRef.toString()} 
                            ref={this._arrayRef[idRef]} {...obj} {...opt} 
                            defaultValue={defaultValue} className={classes}
                            onChange={(e)=> { 
                                $('#contador-textarea').text('TOTAL: '+e.target.value.length); 
                                onChange && onChange(e); 
                                } } 
                            disabled={disabled} required={required}></textarea>
                      <span 
                            id="contador-textarea" className="text-danger"
                        >{'TOTAL: '+defaultValue.length}</span>
                </label>
        } else if(type === 'checkbox'){
            return <div className='checkbox' key={idRef}>
                <label className={className+' checkbox-inline'}>
                    <input ref={this._arrayRef[idRef]} type={type} defaultChecked={defaultValue} 
                    onChange={onChange} disabled={disabled} {...opt} />
                    {icon ? <i className="material-icons">{icon}</i>: null} {label}
                </label>
            </div>
        } else if(type === 'toggle'){
            // RETORNA O ESQUELETO DO COMPONENTE toggle
            /*
            let clsIcone = classNames('material-icons', {
                    'text-red': defaultValue === true,
                    '': defaultValue === false
                })
            return <label title={title} key={idRef} className={className+' Toggle'} htmlFor={'toggle '+idRef.toString()}>
                    <span className={defaultValue ? 'text-red' : ''}>{label}</span>
                    <input onChange={onChange} 
                    defaultChecked={defaultValue} ref={this._arrayRef[idRef]} type="checkbox" name="" id={'toggle '+idRef.toString()} />
                    <i className={clsIcone}>{defaultValue ? 'toggle_on' : 'toggle_off'}</i>
            </label>
            */
            return <Toggle defaultChecked={defaultValue} onChange={onChange} key={idRef}>{label}</Toggle>
        }
        // Bom o tipo tem, agora é extender os valores
        return <label 
                    htmlFor={idRef.toString()} className={className} 
                    key={idRef}>
                    {icon ? <i className="material-icons">{icon}</i>: null} {label}
                    <input name={idRef.toString()} 
                        ref={this._arrayRef[idRef]} type={type} {...obj} {...opt} 
                        defaultValue={defaultValue} className={classes}
                        onChange={onChange} disabled={disabled} 
                        required={required} multiple={multiple} />
                </label>
    }
    //
    getValues(){
        // Retorna um array com os valores
        return this._arrayRef.map(ele=>{
            return ele.current;
        });

    }
    //    
    clearInputForm(idx){
        ReactDOM.findDOMNode(this.getValues()[idx]).value = null;
    }
    //
    componentDidMount(){
        // Tratar o mascaramento nos campos iniciais
        this._arrayRef.forEach((ele,idx)=>{
            if(this.props.schema[idx] && Array.isArray(this.props.schema[idx].mask)){
                // Entao aplica o mascaramento agora
                let arr = this.props.schema[idx].mask;
                $(ReactDOM.findDOMNode(ele.current)).mask(arr[0], arr[1]);
            }
        });
    }
    //
    componentDidUpdate(){
        // Tratar o mascaramento nos campos iniciais
        this._arrayRef.forEach((ele,idx)=>{
            if(this.props.schema[idx] && Array.isArray(this.props.schema[idx].mask)){
                // Entao aplica o mascaramento agora
                let arr = this.props.schema[idx].mask;
                $(ReactDOM.findDOMNode(ele.current)).mask(arr[0], arr[1]);
            }
        });
    }
        
}

EntradaForm.propTypes = {
    /** O schema é a base do EntradaForm. Você envia um array com objetos que representam cada campo do formulário.*/
    schema: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    /** Função de callback responsável por responder ao envio de dados. Esta função tem seu objeto this com acesso ao método getValues que retorna um array com a referencia dos campos */
    onSubmit: PropTypes.func.isRequired,
    /** Valor booleano que controla quando um formulário esta aguardando (geralmente no envio este valor é alterado para true) */
    aguardar: PropTypes.bool,
    /** Classe CSS para ser inclusa no formulário, sendo que sua classe base é EntradaForm */
    className: PropTypes.string,
    /** O estilo que pode ser incluso no formulário. */
    style: PropTypes.object,
    /** Uma classe CSS que pode ser aplicada diretamente ao botão enviar */
    classNameBotao: PropTypes.string,
    /** Uma string que permite exibir uma mensagem de erro para o usuário caso de algum problema ocorra no formulário. */
    erro: PropTypes.string,
    /** Um booleano que define se o formulário será somente de leitura. Isto bloqueia a edição dos campos */
    somenteLeitura: PropTypes.bool,
    /** Define o modo de exibição do formulário, sendo padrão ou mobile (formulario fica com os campos verticais) */
    modo: PropTypes.oneOf(['padrao', 'mobile']),
    
}

export default EntradaForm;