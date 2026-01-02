import { useState, useRef } from 'react';
import { Upload, Save, Download, Eye, Type, Image as ImageIcon } from 'lucide-react';
import { DraggableText, DraggableSignature, type TextElement, type SignatureElement } from '../../components/certificate/DraggableElements';
import { certificateGenerator, type CertificateConfig } from '../../utils/certificateGenerator';

export default function InteractiveCertificateEditor() {
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
    const [textElements, setTextElements] = useState<TextElement[]>([
        {
            id: 'name',
            type: 'name',
            text: 'Nama Peserta',
            x: 760,
            y: 400,
            fontSize: 72,
            fontFamily: 'Times New Roman',
            color: '#1a1a1a',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        {
            id: 'event',
            type: 'event',
            text: 'Workshop Satellite Tracking 2024',
            x: 660,
            y: 550,
            fontSize: 36,
            fontFamily: 'Arial',
            color: '#333333',
            fontWeight: 'normal',
            textAlign: 'center',
        },
        {
            id: 'date',
            type: 'date',
            text: '15 Maret 2024',
            x: 810,
            y: 620,
            fontSize: 28,
            fontFamily: 'Arial',
            color: '#666666',
            fontWeight: 'normal',
            textAlign: 'center',
        },
    ]);

    const [signatureElements, setSignatureElements] = useState<SignatureElement[]>([]);
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<'text' | 'signature' | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);

    const canvasRef = useRef<HTMLDivElement>(null);
    const [canvasSize] = useState({ width: 1920, height: 1080 });

    const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBackgroundFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setBackgroundImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newSignature: SignatureElement = {
                    id: `sig-${Date.now()}`,
                    image: e.target?.result as string,
                    x: 1200,
                    y: 850,
                    width: 200,
                    height: 100,
                    name: 'Nama Penandatangan',
                    title: 'Jabatan',
                };
                setSignatureElements([...signatureElements, newSignature]);
            };
            reader.readAsDataURL(file);
        }
    };

    const addTextElement = () => {
        const newElement: TextElement = {
            id: `text-${Date.now()}`,
            type: 'custom',
            text: 'Text Baru',
            x: 400,
            y: 300,
            fontSize: 32,
            fontFamily: 'Arial',
            color: '#000000',
            fontWeight: 'normal',
            textAlign: 'center',
        };
        setTextElements([...textElements, newElement]);
        setSelectedElement(newElement.id);
        setSelectedType('text');
    };

    const updateTextElement = (updated: TextElement) => {
        setTextElements(textElements.map(el => el.id === updated.id ? updated : el));
    };

    const updateSignatureElement = (updated: SignatureElement) => {
        setSignatureElements(signatureElements.map(el => el.id === updated.id ? updated : el));
    };

    const deleteTextElement = (id: string) => {
        setTextElements(textElements.filter(el => el.id !== id));
        if (selectedElement === id) {
            setSelectedElement(null);
            setSelectedType(null);
        }
    };

    const deleteSignatureElement = (id: string) => {
        setSignatureElements(signatureElements.filter(el => el.id !== id));
        if (selectedElement === id) {
            setSelectedElement(null);
            setSelectedType(null);
        }
    };

    const selectedTextElement = selectedType === 'text'
        ? textElements.find(el => el.id === selectedElement)
        : null;



    const handleGeneratePreview = async () => {
        if (!backgroundFile) return;

        setIsGenerating(true);
        try {
            // For now, use the first text element as participant name
            const nameElement = textElements.find(el => el.type === 'name');
            const eventElement = textElements.find(el => el.type === 'event');
            const dateElement = textElements.find(el => el.type === 'date');

            const config: CertificateConfig = {
                backgroundImage: backgroundFile,
                participantName: nameElement?.text || 'Nama Peserta',
                eventName: eventElement?.text || 'Nama Event',
                eventDate: dateElement?.text || 'Tanggal',
                namePosition: nameElement ? { x: nameElement.x, y: nameElement.y } : undefined,
                eventPosition: eventElement ? { x: eventElement.x, y: eventElement.y } : undefined,
                datePosition: dateElement ? { x: dateElement.x, y: dateElement.y } : undefined,
                nameFont: nameElement ? `${nameElement.fontWeight} ${nameElement.fontSize}px "${nameElement.fontFamily}"` : undefined,
                eventFont: eventElement ? `${eventElement.fontWeight} ${eventElement.fontSize}px "${eventElement.fontFamily}"` : undefined,
                dateFont: dateElement ? `${dateElement.fontWeight} ${dateElement.fontSize}px "${dateElement.fontFamily}"` : undefined,
                nameColor: nameElement?.color,
                eventColor: eventElement?.color,
                dateColor: dateElement?.color,
            };

            const dataUrl = await certificateGenerator.generate(config);
            setPreviewUrl(dataUrl);
        } catch (error) {
            console.error('Error generating preview:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadPreview = () => {
        if (!previewUrl) return;
        const link = document.createElement('a');
        link.download = 'certificate-preview.png';
        link.href = previewUrl;
        link.click();
    };

    const handleSaveTemplate = () => {
        const template = {
            backgroundImage: backgroundImage,
            textElements,
            signatureElements,
            canvasSize,
        };

        const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'certificate-template.json';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-[1800px] mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactive Certificate Editor</h1>
                <p className="text-gray-500">Drag, resize, dan customize semua elemen sertifikat</p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Sidebar - Tools */}
                <div className="col-span-3 space-y-4">
                    {/* Upload Background */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Upload size={18} className="text-red-600" />
                            Background
                        </h3>
                        <label className="block cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleBackgroundUpload}
                                className="hidden"
                            />
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-500 transition-colors">
                                {backgroundImage ? (
                                    <div className="text-sm text-green-600">✓ Background uploaded</div>
                                ) : (
                                    <>
                                        <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                                        <p className="text-xs text-gray-600">Upload Background</p>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>

                    {/* Add Elements */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Add Elements</h3>
                        <div className="space-y-2">
                            <button
                                onClick={addTextElement}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <Type size={16} />
                                Add Text
                            </button>
                            <label className="block">
                                <input
                                    type="file"
                                    accept="image/png"
                                    onChange={handleSignatureUpload}
                                    className="hidden"
                                />
                                <div className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer">
                                    <ImageIcon size={16} />
                                    Add Signature
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Element Properties */}
                    {selectedTextElement && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <h3 className="font-semibold text-gray-900 mb-3">Text Properties</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Text</label>
                                    <input
                                        type="text"
                                        value={selectedTextElement.text}
                                        onChange={(e) => updateTextElement({ ...selectedTextElement, text: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
                                    <input
                                        type="range"
                                        min="12"
                                        max="120"
                                        value={selectedTextElement.fontSize}
                                        onChange={(e) => updateTextElement({ ...selectedTextElement, fontSize: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <div className="text-xs text-gray-500 text-center">{selectedTextElement.fontSize}px</div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Font Family</label>
                                    <select
                                        value={selectedTextElement.fontFamily}
                                        onChange={(e) => updateTextElement({ ...selectedTextElement, fontFamily: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                    >
                                        <option value="Arial">Arial</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Helvetica">Helvetica</option>
                                        <option value="Courier New">Courier New</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                                    <input
                                        type="color"
                                        value={selectedTextElement.color}
                                        onChange={(e) => updateTextElement({ ...selectedTextElement, color: e.target.value })}
                                        className="w-full h-10 rounded-lg cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Font Weight</label>
                                    <select
                                        value={selectedTextElement.fontWeight}
                                        onChange={(e) => updateTextElement({ ...selectedTextElement, fontWeight: e.target.value as 'normal' | 'bold' })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="bold">Bold</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
                        <div className="space-y-2">
                            <button
                                onClick={handleGeneratePreview}
                                disabled={!backgroundFile || isGenerating}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                            >
                                <Eye size={16} />
                                {isGenerating ? 'Generating...' : 'Generate Preview'}
                            </button>
                            <button
                                onClick={handleDownloadPreview}
                                disabled={!previewUrl}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                            >
                                <Download size={16} />
                                Download Preview
                            </button>
                            <button
                                onClick={handleSaveTemplate}
                                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <Save size={16} />
                                Save Template
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Canvas */}
                <div className="col-span-9">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div
                            ref={canvasRef}
                            className="relative mx-auto bg-gray-100 overflow-hidden"
                            style={{
                                width: '100%',
                                maxWidth: '1200px',
                                aspectRatio: '16/9',
                                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                            onClick={() => {
                                setSelectedElement(null);
                                setSelectedType(null);
                            }}
                        >
                            {!backgroundImage && (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <Upload size={64} className="mx-auto mb-4 opacity-50" />
                                        <p className="font-medium">Upload background image to start</p>
                                    </div>
                                </div>
                            )}

                            {/* Text Elements */}
                            {textElements.map((element) => (
                                <DraggableText
                                    key={element.id}
                                    element={element}
                                    onUpdate={updateTextElement}
                                    onDelete={deleteTextElement}
                                    isSelected={selectedElement === element.id && selectedType === 'text'}
                                    onSelect={() => {
                                        setSelectedElement(element.id);
                                        setSelectedType('text');
                                    }}
                                    containerWidth={canvasRef.current?.clientWidth || 1920}
                                    containerHeight={canvasRef.current?.clientHeight || 1080}
                                />
                            ))}

                            {/* Signature Elements */}
                            {signatureElements.map((element) => (
                                <DraggableSignature
                                    key={element.id}
                                    element={element}
                                    onUpdate={updateSignatureElement}
                                    onDelete={deleteSignatureElement}
                                    isSelected={selectedElement === element.id && selectedType === 'signature'}
                                    onSelect={() => {
                                        setSelectedElement(element.id);
                                        setSelectedType('signature');
                                    }}
                                    containerWidth={canvasRef.current?.clientWidth || 1920}
                                    containerHeight={canvasRef.current?.clientHeight || 1080}
                                />
                            ))}
                        </div>

                        {/* Instructions */}
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">💡 How to Use:</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• <strong>Drag</strong> elements to move them</li>
                                <li>• <strong>Click</strong> element to select and edit properties</li>
                                <li>• <strong>Resize</strong> signature by dragging the blue handle</li>
                                <li>• <strong>Delete</strong> element by clicking the × button</li>
                                <li>• <strong>Generate Preview</strong> to see final result</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
