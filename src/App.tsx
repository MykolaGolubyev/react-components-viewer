import * as React from 'react';
import { Component } from 'react';

import { Registry } from './components';
import { ComponentsViewer } from './components';
import { buttonsDemo } from './demos/buttons';
import { linksDemo } from './demos/links';
import { profileScreenDemo } from './demos/profileScreen';

const core = new Registry('core');
core
    .registerAsTabs('Links', linksDemo)
    .registerAsGrid('Links as Grid', 300, linksDemo)
    .registerSingle('Single Screen', profileScreenDemo);

const widgets = new Registry('widgets');
widgets
    .registerAsTwoColumnTable('Buttons', buttonsDemo);

class Demo extends Component {
    render() {
        return (
            <ComponentsViewer registries={[core, widgets]}/>
        );
    }
}

export default Demo;