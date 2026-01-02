/**
 * Certificate Generator - Usage Examples
 * 
 * This file demonstrates how to use the certificate generator utility
 */

import { certificateGenerator, generateCertificate, type CertificateConfig } from './certificateGenerator';

// ============================================
// Example 1: Basic Certificate Generation
// ============================================
export async function example1_BasicGeneration() {
    const config: CertificateConfig = {
        backgroundImage: '/path/to/background.png',
        participantName: 'Ahmad Fauzi',
        eventName: 'Workshop Satellite Tracking 2024',
        eventDate: '15 Maret 2024',
    };

    // Generate and get data URL
    const dataUrl = await generateCertificate(config);
    console.log('Certificate generated:', dataUrl);

    return dataUrl;
}

// ============================================
// Example 2: With Signature
// ============================================
export async function example2_WithSignature() {
    const config: CertificateConfig = {
        backgroundImage: '/path/to/background.png',
        participantName: 'Siti Nurhaliza',
        eventName: 'AMSAT Conference Indonesia',
        eventDate: '20 April 2024',
        signatureName: 'Dr. Ahmad Fauzi',
        signatureTitle: 'Ketua AMSAT-ID',
        signatureImage: '/path/to/signature.png',
    };

    const dataUrl = await certificateGenerator.generate(config);
    return dataUrl;
}

// ============================================
// Example 3: Custom Positioning
// ============================================
export async function example3_CustomPositioning() {
    const config: CertificateConfig = {
        backgroundImage: '/path/to/background.png',
        participantName: 'Budi Santoso',
        eventName: 'Radio Amateur Training',
        eventDate: '25 Maret 2024',

        // Custom positions (x, y coordinates)
        namePosition: { x: 960, y: 500 },
        eventPosition: { x: 960, y: 650 },
        datePosition: { x: 960, y: 750 },

        // Custom fonts
        nameFont: 'bold 80px "Georgia", serif',
        eventFont: '40px "Arial", sans-serif',
        dateFont: '32px "Arial", sans-serif',

        // Custom colors
        nameColor: '#8B0000',
        eventColor: '#2C3E50',
        dateColor: '#7F8C8D',
    };

    const dataUrl = await certificateGenerator.generate(config);
    return dataUrl;
}

// ============================================
// Example 4: Download Certificate
// ============================================
export async function example4_DownloadCertificate() {
    const config: CertificateConfig = {
        backgroundImage: '/path/to/background.png',
        participantName: 'Dewi Lestari',
        eventName: 'Workshop Satellite Tracking 2024',
        eventDate: '15 Maret 2024',
    };

    // Generate and automatically download
    await certificateGenerator.generateAndDownload(
        config,
        'certificate-dewi-lestari.png'
    );
}

// ============================================
// Example 5: Batch Generation
// ============================================
export async function example5_BatchGeneration() {
    const participants = [
        { name: 'Ahmad Fauzi' },
        { name: 'Siti Nurhaliza' },
        { name: 'Budi Santoso' },
        { name: 'Dewi Lestari' },
    ];

    const baseConfig = {
        backgroundImage: '/path/to/background.png',
        eventName: 'Workshop Satellite Tracking 2024',
        eventDate: '15 Maret 2024',
        signatureName: 'Dr. Ahmad Fauzi',
        signatureTitle: 'Ketua AMSAT-ID',
        signatureImage: '/path/to/signature.png',
    };

    // Generate all certificates
    const certificates = await certificateGenerator.generateBatch(
        baseConfig,
        participants
    );

    console.log(`Generated ${certificates.length} certificates`);
    return certificates;
}

// ============================================
// Example 6: Generate as Blob for Upload
// ============================================
export async function example6_GenerateBlob() {
    const config: CertificateConfig = {
        backgroundImage: '/path/to/background.png',
        participantName: 'Ahmad Fauzi',
        eventName: 'Workshop Satellite Tracking 2024',
        eventDate: '15 Maret 2024',
    };

    // Generate as Blob (useful for uploading to server)
    const blob = await certificateGenerator.generateBlob(config);

    // Upload to server
    const formData = new FormData();
    formData.append('certificate', blob, 'certificate.png');

    // await fetch('/api/certificates/upload', {
    //   method: 'POST',
    //   body: formData,
    // });

    return blob;
}

// ============================================
// Example 7: React Component Usage
// ============================================
export function Example7_ReactComponent() {
    // This is a simplified example of how to use in React

    const handleGenerateCertificate = async () => {
        const fileInput = document.getElementById('background-upload') as HTMLInputElement;
        const backgroundFile = fileInput?.files?.[0];

        if (!backgroundFile) {
            alert('Please upload a background image');
            return;
        }

        const config: CertificateConfig = {
            backgroundImage: backgroundFile,
            participantName: 'Ahmad Fauzi',
            eventName: 'Workshop Satellite Tracking 2024',
            eventDate: '15 Maret 2024',
        };

        const dataUrl = await certificateGenerator.generate(config);

        // Display in img element
        const imgElement = document.getElementById('preview') as HTMLImageElement;
        if (imgElement) {
            imgElement.src = dataUrl;
        }
    };

    return handleGenerateCertificate;
}

// ============================================
// Example 8: Custom Canvas Size
// ============================================
export async function example8_CustomSize() {
    const config: CertificateConfig = {
        backgroundImage: '/path/to/background.png',
        participantName: 'Ahmad Fauzi',
        eventName: 'Workshop Satellite Tracking 2024',
        eventDate: '15 Maret 2024',

        // Custom canvas dimensions
        width: 2560,  // 2K resolution
        height: 1440,

        // Adjust positions for larger canvas
        namePosition: { x: 1280, y: 650 },
        eventPosition: { x: 1280, y: 860 },
        datePosition: { x: 1280, y: 1000 },
    };

    const dataUrl = await certificateGenerator.generate(config);
    return dataUrl;
}

// ============================================
// Example 9: Error Handling
// ============================================
export async function example9_ErrorHandling() {
    try {
        const config: CertificateConfig = {
            backgroundImage: '/path/to/background.png',
            participantName: 'Ahmad Fauzi',
            eventName: 'Workshop Satellite Tracking 2024',
            eventDate: '15 Maret 2024',
        };

        const dataUrl = await certificateGenerator.generate(config);
        console.log('Success:', dataUrl);
        return dataUrl;

    } catch (error) {
        console.error('Failed to generate certificate:', error);
        alert('Gagal membuat sertifikat. Pastikan background image valid.');
        throw error;
    }
}

// ============================================
// Example 10: Preview in Canvas Element
// ============================================
export async function example10_CanvasPreview() {
    const config: CertificateConfig = {
        backgroundImage: '/path/to/background.png',
        participantName: 'Ahmad Fauzi',
        eventName: 'Workshop Satellite Tracking 2024',
        eventDate: '15 Maret 2024',
    };

    // Generate certificate
    await certificateGenerator.generate(config);

    // Get the canvas element
    const generatedCanvas = certificateGenerator.getCanvas();

    // Display in your own canvas element
    const displayCanvas = document.getElementById('preview-canvas') as HTMLCanvasElement;
    if (displayCanvas) {
        const ctx = displayCanvas.getContext('2d');
        if (ctx) {
            displayCanvas.width = generatedCanvas.width;
            displayCanvas.height = generatedCanvas.height;
            ctx.drawImage(generatedCanvas, 0, 0);
        }
    }

    return generatedCanvas;
}
