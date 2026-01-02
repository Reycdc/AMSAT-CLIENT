import React, { useState, useRef, useEffect } from 'react';
import { Move, Type, Trash2, Plus } from 'lucide-react';

export interface TextElement {
    id: string;
    type: 'name' | 'event' | 'date' | 'custom';
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    color: string;
    fontWeight: 'normal' | 'bold';
    textAlign: 'left' | 'center' | 'right';
}

export interface SignatureElement {
    id: string;
    image: string | null;
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    title: string;
}

interface DraggableTextProps {
    element: TextElement;
    onUpdate: (element: TextElement) => void;
    onDelete: (id: string) => void;
    isSelected: boolean;
    onSelect: () => void;
    containerWidth: number;
    containerHeight: number;
}

export function DraggableText({
    element,
    onUpdate,
    onDelete,
    isSelected,
    onSelect,
    containerWidth,
    containerHeight,
}: DraggableTextProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        onSelect();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - element.x,
            y: e.clientY - element.y,
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        const newX = Math.max(0, Math.min(containerWidth, e.clientX - dragStart.x));
        const newY = Math.max(0, Math.min(containerHeight, e.clientY - dragStart.y));

        onUpdate({ ...element, x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, dragStart]);

    return (
        <div
            onMouseDown={handleMouseDown}
            style={{
                position: 'absolute',
                left: element.x,
                top: element.y,
                fontSize: element.fontSize,
                fontFamily: element.fontFamily,
                color: element.color,
                fontWeight: element.fontWeight,
                textAlign: element.textAlign,
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                padding: '4px 8px',
                border: isSelected ? '2px dashed #ef4444' : '2px dashed transparent',
                borderRadius: '4px',
                backgroundColor: isSelected ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                transition: isDragging ? 'none' : 'all 0.2s',
            }}
        >
            {element.text}
            {isSelected && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(element.id);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                    style={{ fontSize: '12px' }}
                >
                    ×
                </button>
            )}
        </div>
    );
}

interface DraggableSignatureProps {
    element: SignatureElement;
    onUpdate: (element: SignatureElement) => void;
    onDelete: (id: string) => void;
    isSelected: boolean;
    onSelect: () => void;
    containerWidth: number;
    containerHeight: number;
}

export function DraggableSignature({
    element,
    onUpdate,
    onDelete,
    isSelected,
    onSelect,
    containerWidth,
    containerHeight,
}: DraggableSignatureProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        onSelect();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - element.x,
            y: e.clientY - element.y,
        });
    };

    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeStart({
            width: element.width,
            height: element.height,
            x: e.clientX,
            y: e.clientY,
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const newX = Math.max(0, Math.min(containerWidth - element.width, e.clientX - dragStart.x));
            const newY = Math.max(0, Math.min(containerHeight - element.height, e.clientY - dragStart.y));
            onUpdate({ ...element, x: newX, y: newY });
        } else if (isResizing) {
            const deltaX = e.clientX - resizeStart.x;
            const deltaY = e.clientY - resizeStart.y;
            const newWidth = Math.max(50, resizeStart.width + deltaX);
            const newHeight = Math.max(50, resizeStart.height + deltaY);
            onUpdate({ ...element, width: newWidth, height: newHeight });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    useEffect(() => {
        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isResizing, dragStart, resizeStart]);

    if (!element.image) return null;

    return (
        <div
            onMouseDown={handleMouseDown}
            style={{
                position: 'absolute',
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                border: isSelected ? '2px dashed #ef4444' : '2px dashed transparent',
                borderRadius: '4px',
                padding: '4px',
                backgroundColor: isSelected ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
            }}
        >
            <img
                src={element.image}
                alt="Signature"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                }}
            />
            {isSelected && (
                <>
                    {/* Delete button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(element.id);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors z-10"
                        style={{ fontSize: '12px' }}
                    >
                        ×
                    </button>
                    {/* Resize handle */}
                    <div
                        onMouseDown={handleResizeMouseDown}
                        className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-600 rounded-full cursor-nwse-resize hover:bg-blue-700 transition-colors z-10"
                        style={{
                            border: '2px solid white',
                        }}
                    />
                </>
            )}
        </div>
    );
}
