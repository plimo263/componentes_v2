import React from 'react';
import Toggle from '../components/toggle';
import {action} from '@storybook/addon-actions'

export default {
    title: 'Toggle',
    component: Toggle,
}

export const comMinimo = ()=> <Toggle onChange={action('clicado')} />;

// Ativado
export const ativado = ()=> <Toggle label='ATIVADO' onChange={action('clicado')} defaultChecked />;
// OBJ STORY
let objDescricao =  {
    parameters: {
        docs: {
            storyDescription: 'COM A PROPS defaultChecked PASSADA COMO true'
        }
    }
};

ativado.story = objDescricao;
