import 'url-search-params-polyfill';

import { ComponentsViewerState } from './ComponentsViewerState';
import { Registry, Registries } from '../';
import { DemoEntryAndRegistry } from '../registry/DemoEntryAndRegistry';

const queryParamNames = {
    registryName: 'registryName',
    demoName: 'demoName',
    entryTitle: 'entryTitle',
    fullScreen: 'fullScreen'
};

export class ComponentsViewerStateCreator {
    private _registries: Registries;

    private static firstDemoName(registry: Registry) {
        return registry.names[0];
    }

    private static firstTitleByDemoName(registry: Registry, name: string) {
        return registry.findByName(name).firstEntryTitle;
    }

    constructor(registries: Registries) {
        this._registries = registries;
    }

    stateFromUrl(url: string): ComponentsViewerState {
        const searchParams = new URLSearchParams(url);

        const miniAppByUrl = this.miniAppByUrl(url);
        if (miniAppByUrl) {
            return {
                registryName: miniAppByUrl.registry.name,
                demoName: miniAppByUrl.demoEntry.name,
                entryTitle: miniAppByUrl.demoEntry.firstEntryTitle,
                isFullScreen: true,
                filterText: ''
            };
        }

        const registryName = searchParams.get(queryParamNames.registryName) || this._registries.first.name;
        const registry = this._registries.registryByName(registryName);

        const demoName = searchParams.get(queryParamNames.demoName) ||
            ComponentsViewerStateCreator.firstDemoName(registry);

        const entryTitle = searchParams.get(queryParamNames.entryTitle) ||
            ComponentsViewerStateCreator.firstTitleByDemoName(registry, demoName);

        const fullScreenValue = searchParams.get(queryParamNames.fullScreen) || 'false';
        const isFullScreen = fullScreenValue === 'true';

        return {
            registryName,
            demoName,
            entryTitle,
            isFullScreen,
            filterText: ''
        };
    }

    buildUrlSearchParams(state: ComponentsViewerState): string {
        const searchParams = new URLSearchParams();

        Object.keys(state).forEach(k => {
            const v = state[k];

            if (v) {
                searchParams.set(k, v.toString());
            }
        });

        return searchParams.toString();
    }

    private miniAppByUrl(url: string): DemoEntryAndRegistry | null {
        const foundDemos = this._registries.registries
            .map(r => ({miniApp: r.firstMiniAppByUrl(url), registry: r}))
            .filter(found => found.miniApp !== null);

        return foundDemos.length > 0 ?
            {demoEntry: foundDemos[0].miniApp, registry: foundDemos[0].registry} as DemoEntryAndRegistry :
            null;
    }
}