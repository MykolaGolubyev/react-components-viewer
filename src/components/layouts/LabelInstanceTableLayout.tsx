import * as React from 'react';

import { LayoutProps } from './LayoutProps';
import { AllItemsAtOnceLayoutBase } from './AllItemsAtOnceLayoutBase';

import { DescriptionAndInstanceLayoutItem } from './DescriptionAndInstanceLayoutItem';

import './LabelInstanceTableLayout.css';

const GridItem = DescriptionAndInstanceLayoutItem('table-item');

export function LabelInstanceTableLayout({selectedTitle, demoInstancesGroup, onSelect}: LayoutProps) {
    return (
        <AllItemsAtOnceLayoutBase
            topLevelClassName="rcw-label-instance-table-layout"
            selectedTitle={selectedTitle}
            demoInstancesGroup={demoInstancesGroup}
            onSelect={onSelect}
            LayoutItemComponent={GridItem}
        />
    );
}
