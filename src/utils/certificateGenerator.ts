/**
 * Certificate Generator Utility
 * Generates certificates by overlaying text on background images using HTML5 Canvas
 */

import { BarcodeGenerator } from './barcodeGenerator';
import { generateCertificateNumber } from './certificateNumberGenerator';

export interface CertificateConfig {
    backgroundImage: string | File; // URL or File object
    participantName: string;
    eventName: string;
    eventDate: string;
    organizerName?: string;
    signatureName?: string;
    signatureTitle?: string;
    signatureImage?: string | File;

    // Barcode configuration
    certificateNumber?: string; // If not provided, will be auto-generated
    showBarcode?: boolean; // Default: true
    barcodePosition?: { x: number; y: number }; // Default: bottom-left

    // Text positioning and styling
    namePosition?: { x: number; y: number };
    eventPosition?: { x: number; y: number };
    datePosition?: { x: number; y: number };
    signaturePosition?: { x: number; y: number };

    nameFont?: string;
    eventFont?: string;
    dateFont?: string;

    nameColor?: string;
    eventColor?: string;
    dateColor?: string;

    // Canvas dimensions
    width?: number;
    height?: number;
}

export class CertificateGenerator {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
    }

    /**
     * Load image from URL or File
     */
    private async loadImage(source: string | File): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            if (source instanceof File) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target?.result as string;
                };
                reader.onerror = reject;
                reader.readAsDataURL(source);
            } else {
                img.src = source;
            }

            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    }

    /**
     * Draw text with center alignment
     */
    private drawCenteredText(
        text: string,
        x: number,
        y: number,
        font: string,
        color: string
    ) {
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x, y);
    }

    /**
     * Generate certificate
     */
    async generate(config: CertificateConfig): Promise<string> {
        // Set canvas dimensions
        const width = config.width || 1920;
        const height = config.height || 1080;
        this.canvas.width = width;
        this.canvas.height = height;

        // Load and draw background
        const bgImage = await this.loadImage(config.backgroundImage);
        this.ctx.drawImage(bgImage, 0, 0, width, height);

        // Default positions (centered)
        const centerX = width / 2;
        const nameY = config.namePosition?.y || height * 0.45;
        const eventY = config.eventPosition?.y || height * 0.60;
        const dateY = config.datePosition?.y || height * 0.70;

        // Draw participant name
        this.drawCenteredText(
            config.participantName,
            config.namePosition?.x || centerX,
            nameY,
            config.nameFont || 'bold 72px "Times New Roman", serif',
            config.nameColor || '#1a1a1a'
        );

        // Draw event name
        this.drawCenteredText(
            config.eventName,
            config.eventPosition?.x || centerX,
            eventY,
            config.eventFont || '36px "Arial", sans-serif',
            config.eventColor || '#333333'
        );

        // Draw event date
        this.drawCenteredText(
            config.eventDate,
            config.datePosition?.x || centerX,
            dateY,
            config.dateFont || '28px "Arial", sans-serif',
            config.dateColor || '#666666'
        );

        // Draw signature if provided
        if (config.signatureImage) {
            const sigImage = await this.loadImage(config.signatureImage);
            const sigX = config.signaturePosition?.x || width * 0.7;
            const sigY = config.signaturePosition?.y || height * 0.85;
            const sigWidth = 200;
            const sigHeight = (sigImage.height / sigImage.width) * sigWidth;

            this.ctx.drawImage(
                sigImage,
                sigX - sigWidth / 2,
                sigY - sigHeight,
                sigWidth,
                sigHeight
            );

            // Draw signature name and title
            if (config.signatureName) {
                this.drawCenteredText(
                    config.signatureName,
                    sigX,
                    sigY + 10,
                    'bold 24px "Arial", sans-serif',
                    '#1a1a1a'
                );
            }

            if (config.signatureTitle) {
                this.drawCenteredText(
                    config.signatureTitle,
                    sigX,
                    sigY + 40,
                    '20px "Arial", sans-serif',
                    '#666666'
                );
            }
        }

        // Draw barcode if enabled (default: true)
        if (config.showBarcode !== false) {
            try {
                // Generate certificate number if not provided
                const certificateNumber = config.certificateNumber || generateCertificateNumber(
                    config.eventName,
                    config.eventDate
                );

                // Generate barcode
                const barcodeDataUrl = BarcodeGenerator.generate({
                    value: certificateNumber,
                    width: 1.5,
                    height: 40,
                    fontSize: 10,
                    displayValue: true,
                    background: 'transparent',
                    lineColor: '#000000',
                });

                // Load barcode image
                const barcodeImage = await this.loadImage(barcodeDataUrl);

                // Position barcode at bottom-left
                const barcodeX = config.barcodePosition?.x || 50;
                const barcodeY = config.barcodePosition?.y || height - 100;
                const barcodeWidth = 300;
                const barcodeHeight = (barcodeImage.height / barcodeImage.width) * barcodeWidth;

                this.ctx.drawImage(
                    barcodeImage,
                    barcodeX,
                    barcodeY,
                    barcodeWidth,
                    barcodeHeight
                );
            } catch (error) {
                console.error('Error generating barcode:', error);
                // Continue without barcode if there's an error
            }
        }

        // Return as data URL
        return this.canvas.toDataURL('image/png', 1.0);
    }

    /**
     * Generate certificate and download
     */
    async generateAndDownload(
        config: CertificateConfig,
        filename: string = 'certificate.png'
    ): Promise<void> {
        const dataUrl = await this.generate(config);

        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
    }

    /**
     * Generate certificate as Blob
     */
    async generateBlob(config: CertificateConfig): Promise<Blob> {
        const dataUrl = await this.generate(config);
        const response = await fetch(dataUrl);
        return response.blob();
    }

    /**
     * Batch generate certificates for multiple participants
     */
    async generateBatch(
        baseConfig: Omit<CertificateConfig, 'participantName'>,
        participants: Array<{ name: string; filename?: string }>
    ): Promise<string[]> {
        const results: string[] = [];

        for (const participant of participants) {
            const config: CertificateConfig = {
                ...baseConfig,
                participantName: participant.name,
            };

            const dataUrl = await this.generate(config);
            results.push(dataUrl);
        }

        return results;
    }

    /**
     * Get canvas element for preview
     */
    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }
}

// Export singleton instance
export const certificateGenerator = new CertificateGenerator();

// Helper function for quick generation
export async function generateCertificate(
    config: CertificateConfig
): Promise<string> {
    return certificateGenerator.generate(config);
}
