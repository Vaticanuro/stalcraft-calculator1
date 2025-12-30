// Файл: services/CraftCalculator.ts
class CraftCalculator {
    // Основной метод
    async calculate(
        itemId: string,
        quantity: number,
        context: CraftContext
    ): Promise<CraftCalculation> {
        // 1. Построение дерева с обнаружением циклов
        const craftTree = this.buildCraftTree(itemId, quantity, context);

        // 2. Агрегация затрат (рубли, энергия, материалы)
        const totalCost = this.aggregateCosts(craftTree, context);

        // 3. Построение итогового объекта расчёта
        return {
            targetItemId: itemId,
            targetQuantity: quantity,
            craftTree,
            totalCost,
            requiredPerks: this.extractRequiredPerks(craftTree),
            warnings: [], // заполняем при обнаружении проблем
            errors: []
        };
    }

    private buildCraftTree(
        itemId: string,
        quantity: number,
        context: CraftContext,
        visited: Set<string> = new Set() // Для отслеживания циклов!
    ): CraftTreeNode {
        // БАЗОВЫЙ СЛУЧАЙ 1: Обнаружен цикл
        if (visited.has(itemId)) {
            return {
                itemId,
                quantityNeeded: quantity,
                resolvedSource: 'craft', // или другой логичный вариант
                isCycle: true, // ВАЖНО: помечаем узел как цикл
                children: []
            };
        }

        // БАЗОВЫЙ СЛУЧАЙ 2: Предмет можно купить или взять из инвентаря
        if (this.shouldBuyFromAuction(itemId, context)) {
            return {
                itemId,
                quantityNeeded: quantity,
                resolvedSource: 'auction',
                isCycle: false,
                children: []
            };
        }

        // РЕКУРСИВНЫЙ СЛУЧАЙ: Нужно крафтить
        const newVisited = new Set(visited);
        newVisited.add(itemId);

        // Выбор оптимального рецепта (здесь будет сложная логика)
        const recipe = this.selectOptimalRecipe(itemId, context);

        const node: CraftTreeNode = {
            itemId,
            quantityNeeded: quantity,
            resolvedSource: 'craft',
            isCycle: false,
            selectedRecipeId: recipe.id, // если назначим id рецепту
            children: []
        };

        // Рекурсивно обрабатываем ингредиенты
        for (const ingredient of recipe.ingredients) {
            const childNode = this.buildCraftTree(
                ingredient.item,
                ingredient.amount * quantity, // Умножаем на количество!
                context,
                newVisited // передаём обновлённый набор посещённых узлов
            );
            node.children.push(childNode);
        }

        return node;
    }
}