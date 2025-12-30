// utils/craftTreeTranslator.ts
export function translateCraftTree(
    node: CraftTreeNode, 
    getName: (id: string) => string
): TranslatedCraftTreeNode {
    return {
        ...node,
        // Добавляем русское название
        itemName: getName(node.itemId),
        // Рекурсивно обрабатываем детей
        children: node.children.map(child => 
            translateCraftTree(child, getName)
        ),
        // Можно добавить иконку и цвет
        icon: getIcon(node.itemId),
        color: getColor(node.itemId)
    };
}

// Где-то в компоненте дерева крафта:
const CraftTreeComponent: React.FC<{tree: CraftTreeNode}> = ({ tree }) => {
    const { getName } = useItemNames();
    const translatedTree = useMemo(() => 
        translateCraftTree(tree, getName), 
        [tree, getName]
    );
    
    return <CraftTreeNodeView node={translatedTree} />;
};