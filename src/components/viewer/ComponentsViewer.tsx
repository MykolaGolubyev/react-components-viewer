import * as React from 'react';
import { Component } from 'react';

import { Registry } from '../registry/Registry';
import { Registries } from '../registry/Registries';

import { ComponentDemo } from './ComponentDemo';

import { RegistrySelection } from './RegistrySelection';
import { TableOfContents } from './toc/TableOfContents';

import { Toolbar, ToolbarActions } from './toolbar/Toolbar';
import { ComponentsViewerState } from './ComponentsViewerState';
import { ComponentsViewerStateCreator } from './ComponentsViewerStateCreator';

import './ComponentsViewer.css';

export interface Props {
    registries: Registry[];
}

class ComponentsViewer extends Component<Props, ComponentsViewerState> {
    private _registries: Registries;
    private _stateCreator: ComponentsViewerStateCreator;
    private _actions: ToolbarActions;

    constructor(props: Props) {
        super(props);

        const {registries} = this.props;

        this._registries = new Registries(registries);
        this._stateCreator = new ComponentsViewerStateCreator(this._registries);

        this._actions = {onFullScreen: this.onFullScreen};

        this.state = this.stateFromUrl();
    }

    render() {
        const {
            registryName,
            demoName,
            entryTitle,
            filterText,
            isFullScreen
        } = this.state;

        const demoEntry = this.selectedRegistry.findByName(demoName);

        if (demoEntry.isMiniApp() || isFullScreen) {
            return (
                <ComponentDemo
                    demoEntry={demoEntry}
                    selectedTitle={entryTitle}
                    onlySelected={true}
                    onInstanceSelect={this.selectInstanceByTitle}
                />
            );
        }

        return (
            <div className="rcw-components-viewer">
                <div className="rcw-registry-selection-panel">
                    <RegistrySelection
                        names={this._registries.names}
                        selectedName={registryName}
                        onSelect={this.selectRegistry}
                    />
                </div>

                <div className="rcw-toolbar-panel">
                    <Toolbar actions={this._actions}/>
                </div>

                <div className="rcw-search-box">
                    <input
                        className="rcw-search-box-input"
                        value={filterText}
                        placeholder="filter by demo name..."
                        onChange={this.onFilterTextChange}
                    />
                </div>

                <div className="rcw-toc-panel">
                    <TableOfContents
                        names={this.demoNames}
                        selectedName={demoName}
                        onSelect={this.selectDemo}
                    />
                </div>

                <div className="rcw-preview">
                    <ComponentDemo
                        demoEntry={demoEntry}
                        selectedTitle={entryTitle}
                        onlySelected={false}
                        onInstanceSelect={this.selectInstanceByTitle}
                    />
                </div>
            </div>
        );
    }

    stateFromUrl() {
        return this._stateCreator.stateFromUrl(document.location.search);
    }

    updateStateFromUrl() {
        this.setState(this.stateFromUrl());
    }

    componentDidMount() {
        this.updateStateFromUrl();
        this.subscribeToUrlChanges();
    }

    private subscribeToUrlChanges() {
        window.addEventListener('popstate', () => {
            this.updateStateFromUrl();
        });
    }

    private onFullScreen = () => {
        if (this.state.isFullScreen) {
            return;
        }

        this.pushUrl(this.state.registryName, this.state.demoName, this.state.entryTitle, true);
    }

    private selectRegistry = (registryName: string) => {
        this.pushUrl(registryName, '', '', this.state.isFullScreen);
    }

    private selectDemo = (demoName: string) => {
        this.pushUrl(this.state.registryName, demoName, '', this.state.isFullScreen);
    }

    private selectInstanceByTitle = (title: string) => {
        this.pushUrl(this.state.registryName, this.state.demoName, title, this.state.isFullScreen);
    }

    private get selectedRegistry(): Registry {
        const {registryName} = this.state;
        return this._registries.registryByName(registryName);
    }

    private get demoNames() {
        const {filterText} = this.state;

        return this.selectedRegistry.names.filter(name =>
            name.toLocaleLowerCase().indexOf(filterText.toLowerCase()) >= 0);
    }

    private pushUrl(registryName: string, demoName: string, entryTitle: string, isFullScreen: boolean) {
        const searchParams = this._stateCreator.buildUrlSearchParams(
            {registryName, demoName, entryTitle, isFullScreen, filterText: ''});
        const newUrl = '?' + searchParams;

        window.history.pushState({}, '', newUrl);
        this.updateStateFromUrl();
    }

    private onFilterTextChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({filterText: e.currentTarget.value});
    }
}

export { ComponentsViewer };
