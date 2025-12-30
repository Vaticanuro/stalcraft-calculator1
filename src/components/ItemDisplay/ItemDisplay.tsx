// components/ItemDisplay/ItemDisplay.tsx
import React from 'react';
import { useItemNames } from '../../hooks/useItemNames';

interface ItemDisplayProps {
    itemId: string;
    amount?: number;
    showIcon?: boolean;
    className?: string;
    onClick?: () => void;
}

export const ItemDisplay: React.FC<ItemDisplayProps> = ({
    itemId,
    amount,
    showIcon = true,
    className = '',
    onClick
}) => {
    const { getName, getIcon } = useItemNames();
    
    return (
        <div 
            className={`item-display ${className}`}
            onClick={onClick}
            title={`ID: ${itemId}`}
        >
            {showIcon && (
                <img 
                    src={getIcon(itemId)} 
                    alt={getName(itemId)}
                    className="item-icon"
                    loading="lazy"
                />
            )}
            <span className="item-name">
                {getName(itemId)}
                {amount !== undefined && amount > 1 && (
                    <span className="item-amount"> ×{amount}</span>
                )}
            </span>
        </div>
    );
};

// components/ItemDisplay/ItemDisplayList.tsx
interface ItemDisplayListProps {
    items: Array<{id: string, amount: number}>;
    compact?: boolean;
}

export const ItemDisplayList: React.FC<ItemDisplayListProps> = ({ items, compact }) => {
    return (
        <div className={`item-list ${compact ? 'compact' : ''}`}>
            {items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="list-item">
                    <ItemDisplay 
                        itemId={item.id} 
                        amount={item.amount}
                        showIcon={!compact}
                    />
                </div>
            ))}
        </div>
    );
};