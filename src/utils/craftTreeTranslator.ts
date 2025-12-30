// utils/craftTreeTranslator.ts

// Временные заглушки типов (позже вынесете в отдельный файл типов)
interface CraftTreeNode {
    itemId: string;
    quantity: number;
    children: CraftTreeNode[];
}

interface TranslatedCraftTreeNode extends CraftTreeNode {
    itemName: string;
    icon?: string;
    color?: string;
}

// Временные заглушки функций (позже замените на реальные)
function getIcon(itemId: string): string {
    return `/icons/${itemId}.png`; // Пример пути
}

function getColor(itemId: string): string {
    return 'DEFAULT'; // Пример цвета
}

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

// Пример использования (этот код можно удалить или закомментировать)
/*
// Где-то в компоненте дерева крафта:
const CraftTreeComponent: React.FC<{tree: CraftTreeNode}> = ({ tree }) => {
    const { getName } = useItemNames();
    const translatedTree = useMemo(() => 
        translateCraftTree(tree, getName), 
        [tree, getName]
    );
    
    return <CraftTreeNodeView node={translatedTree} />;
};
*/