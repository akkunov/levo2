'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

type ProductSpecificationsProps = {
    specs: string[];
};

export function ProductSpecifications({
                                                  specs,
                                              }: ProductSpecificationsProps) {
    const [expanded, setExpanded] = useState(false);

    const visibleSpecs = expanded ? specs : specs.slice(0, 6);
    const hasMore = specs.length > 6;

    return (
        <div className="premium-specifications-content">
            <div className="premium-specifications-heading">
                <h3>Характеристики</h3>
                <span>{specs.length} параметров</span>
            </div>

            {specs.length > 0 ? (
                <>
                    <div className="premium-spec-list">
                        {visibleSpecs.map((spec, index) => (
                            <div
                                className="premium-spec-row"
                                key={`${spec}-${index}`}
                            >
                                <span>{spec}</span>
                                <Check size={17} strokeWidth={1.5} />
                            </div>
                        ))}
                    </div>

                    {hasMore && (
                        <button
                            type="button"
                            className="premium-spec-toggle"
                            onClick={() => setExpanded((current) => !current)}
                            aria-expanded={expanded}
                        >
                            {expanded ? 'Скрыть' : 'Посмотреть все характеристики'}
                            <ChevronDown
                                size={17}
                                className={expanded ? 'is-rotated' : ''}
                            />
                        </button>
                    )}
                </>
            ) : (
                <p className="premium-empty-specs">
                    Характеристики уточняются. Свяжитесь с нами, чтобы узнать
                    подробности о модели.
                </p>
            )}
        </div>
    );
}
