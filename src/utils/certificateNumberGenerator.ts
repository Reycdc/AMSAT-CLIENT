/**
 * Certificate Number Generator
 * Generates unique certificate numbers with format: NNNNN/EVENT-NAME/AMSAT-ID/YYYY
 */

export interface CertificateNumberConfig {
    eventName: string;
    eventDate: Date | string;
    sequenceNumber?: number;
}

export class CertificateNumberGenerator {
    /**
     * Generate a 5-digit sequence number based on date and random
     */
    static generateSequenceNumber(date: Date | string): number {
        const d = typeof date === 'string' ? new Date(date) : date;

        // Use date components to create a base number
        const year = d.getFullYear().toString().slice(-2); // Last 2 digits of year
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');

        // Generate random 2-digit number
        const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');

        // Combine to create 5-digit number: YY + MM + D + R
        // Example: 24 + 03 + 1 + 56 = 24315 (but we need exactly 5 digits)
        const baseNumber = parseInt(year + month.slice(1) + day.slice(1) + random.slice(0, 1));

        // Ensure it's 5 digits
        return baseNumber % 100000;
    }

    /**
     * Format event name for certificate number (remove spaces, uppercase)
     */
    static formatEventName(eventName: string): string {
        return eventName
            .toUpperCase()
            .replace(/\s+/g, '-')
            .replace(/[^A-Z0-9-]/g, '')
            .substring(0, 20); // Limit length
    }

    /**
     * Generate complete certificate number
     */
    static generate(config: CertificateNumberConfig): string {
        const date = typeof config.eventDate === 'string'
            ? new Date(config.eventDate)
            : config.eventDate;

        const sequenceNumber = config.sequenceNumber || this.generateSequenceNumber(date);
        const formattedSequence = sequenceNumber.toString().padStart(5, '0');
        const formattedEventName = this.formatEventName(config.eventName);
        const year = date.getFullYear();

        return `${formattedSequence}/${formattedEventName}/AMSAT-ID/${year}`;
    }

    /**
     * Parse certificate number back to components
     */
    static parse(certificateNumber: string): {
        sequenceNumber: string;
        eventName: string;
        organization: string;
        year: string;
    } | null {
        const parts = certificateNumber.split('/');

        if (parts.length !== 4) {
            return null;
        }

        return {
            sequenceNumber: parts[0],
            eventName: parts[1],
            organization: parts[2],
            year: parts[3],
        };
    }

    /**
     * Generate multiple certificate numbers for batch
     */
    static generateBatch(
        config: CertificateNumberConfig,
        count: number
    ): string[] {
        const date = typeof config.eventDate === 'string'
            ? new Date(config.eventDate)
            : config.eventDate;

        const baseSequence = config.sequenceNumber || this.generateSequenceNumber(date);
        const numbers: string[] = [];

        for (let i = 0; i < count; i++) {
            const sequenceNumber = (baseSequence + i) % 100000;
            numbers.push(this.generate({
                ...config,
                sequenceNumber,
            }));
        }

        return numbers;
    }
}

// Export convenience function
export function generateCertificateNumber(
    eventName: string,
    eventDate: Date | string,
    sequenceNumber?: number
): string {
    return CertificateNumberGenerator.generate({
        eventName,
        eventDate,
        sequenceNumber,
    });
}
