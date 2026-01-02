/**
 * Barcode Generator for Certificates
 * Uses JsBarcode to generate barcodes for certificate numbers
 */

import JsBarcode from 'jsbarcode';

export interface BarcodeConfig {
    value: string;
    width?: number;
    height?: number;
    displayValue?: boolean;
    fontSize?: number;
    textMargin?: number;
    background?: string;
    lineColor?: string;
}

export class BarcodeGenerator {
    /**
     * Generate barcode as data URL
     */
    static generate(config: BarcodeConfig): string {
        const canvas = document.createElement('canvas');

        try {
            JsBarcode(canvas, config.value, {
                format: 'CODE128',
                width: config.width || 2,
                height: config.height || 50,
                displayValue: config.displayValue !== false,
                fontSize: config.fontSize || 12,
                textMargin: config.textMargin || 5,
                background: config.background || '#ffffff',
                lineColor: config.lineColor || '#000000',
                margin: 10,
            });

            return canvas.toDataURL('image/png');
        } catch (error) {
            console.error('Error generating barcode:', error);
            throw error;
        }
    }

    /**
     * Generate barcode and return as canvas element
     */
    static generateCanvas(config: BarcodeConfig): HTMLCanvasElement {
        const canvas = document.createElement('canvas');

        JsBarcode(canvas, config.value, {
            format: 'CODE128',
            width: config.width || 2,
            height: config.height || 50,
            displayValue: config.displayValue !== false,
            fontSize: config.fontSize || 12,
            textMargin: config.textMargin || 5,
            background: config.background || '#ffffff',
            lineColor: config.lineColor || '#000000',
            margin: 10,
        });

        return canvas;
    }

    /**
     * Validate if a string can be encoded as barcode
     */
    static isValid(value: string): boolean {
        try {
            const canvas = document.createElement('canvas');
            JsBarcode(canvas, value, { format: 'CODE128' });
            return true;
        } catch {
            return false;
        }
    }
}

// Export convenience function
export function generateBarcode(
    value: string,
    options?: Partial<BarcodeConfig>
): string {
    return BarcodeGenerator.generate({
        value,
        ...options,
    });
}
