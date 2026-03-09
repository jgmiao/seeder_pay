'use client';

import * as React from 'react';

interface SwitchProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    id?: string;
    className?: string;
}

export function Switch({
    checked,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    id,
    className = '',
}: SwitchProps) {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;

    const handleClick = () => {
        if (disabled) return;
        const next = !isChecked;
        if (!isControlled) setInternalChecked(next);
        onCheckedChange?.(next);
    };

    return (
        <button
            id={id}
            role="switch"
            aria-checked={isChecked}
            disabled={disabled}
            onClick={handleClick}
            className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900
        ${isChecked ? 'bg-gray-900' : 'bg-gray-200'}
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${className}
      `}
            type="button"
        >
            <span
                className={`
          inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-150 ease-in-out
          ${isChecked ? 'translate-x-6' : 'translate-x-1'}
        `}
            />
        </button>
    );
}
