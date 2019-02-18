import * as React from 'react';

import { Registries } from './components';
import { ComponentViewer } from './components';
import { buttonsDemo } from './demos/buttons';
import { linksDemo } from './demos/links';
import { profileScreenDemo } from './demos/profileScreen';
import { formsDemo } from './demos/forms';
import { sideBySideDemo } from './demos/sideBySide';
import { inputsDemo } from './demos/inputs';
import { WrapperProps } from './components/registry/componentWrapper';

const registries = new Registries({componentWrapper: DemoWrapper});
registries.add('widgets')
    .registerAsGrid('Links', 300, linksDemo)
    .registerAsTwoColumnTable('Forms', formsDemo)
    .registerAsTwoColumnTable('Buttons', buttonsDemo)
    .registerAsRows('Inputs', inputsDemo);

registries.add('layouts')
    .registerSingle('Side by Side', sideBySideDemo);

registries.add('end to end')
    .registerSingle('Single Screen', profileScreenDemo)
    .registerAsMiniApp('Single Screen mini app', '/app', profileScreenDemo);

export class App extends React.Component {
    render() {
        return (
            <ComponentViewer
                registries={registries}
                dropDown={{
                    label: 'Brand',
                    items: [
                        {label: 'Brand-A', hotKey: 'Alt 1'},
                        {label: 'B-Brand', hotKey: 'Alt 2'}
                    ],
                    onSelect: this.onBrandSelect
                }}
            />
        );
    }

    private onBrandSelect(brand: string) {
        console.log('selected brand', brand);
    }
}

function DemoWrapper({OriginalComponent}: WrapperProps) {
    return (
        <div className="component-demo-local-wrapper">
            <OriginalComponent/>
        </div>
    );
}