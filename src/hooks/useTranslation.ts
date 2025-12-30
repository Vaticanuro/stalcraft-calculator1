// hooks/useTranslation.ts
import { useContext } from 'react';
import { TranslationContext } from '../contexts/TranslationContext';

export function useTranslation() {
    const context = useContext(TranslationContext);
    
    if (!context) {
        throw new Error('useTranslation must be used within TranslationProvider');
    }
    
    return {
        // Основные методы
        tItem: (itemId: string) => context.getItemName(itemId),
        tItemFull: (itemId: string) => context.getItemDisplayInfo(itemId),
        tPerk: (perkId: string) => context.getPerkName(perkId),
        
        // Для таблиц и списков
        translateItemList: (items: Array<{id: string, amount: number}>) => 
            items.map(item => ({
                ...item,
                name: context.getItemName(item.id)
            })),
        
        // Для дерева крафта
        translateCraftTree: (node: CraftTreeNode): TranslatedCraftTreeNode => ({
            ...node,
            itemName: context.getItemName(node.itemId),
            children: node.children.map(child => 
                this.translateCraftTree(child)
            )
        })
    };
}