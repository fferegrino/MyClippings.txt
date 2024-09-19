import { useState } from 'react';
import QuotesView from './QuotesView';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import './App.css';
import { parseLinesIntoClipping } from './parseLinesIntoClipping';
import { Clipping } from './Clipping';

function App() {

    const [clippings, setClippings] = useState<{ [key: string]: Clipping[] }>({});

    const onDrop = (acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const text = e.target?.result as string;
                const parsedClippings = parseMyClippingsTxtFile(text);
                setClippings(parsedClippings);
            };

            reader.readAsText(file);
        })
    }

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { "text/plain": [".txt"] } })

    const resetClippings = () => {
        setClippings({});
    };

    const parseMyClippingsTxtFile = (text: string) => {
        const entries = text.split('==========');
        const rawClippings: { [key: string]: Clipping[] } = {};
        const groupedClippings: { [key: string]: Clipping[] } = {};

        entries.forEach((entry) => {
            const clipping = parseLinesIntoClipping(entry);
            if (clipping) {
                if (!rawClippings[clipping.title]) {
                    rawClippings[clipping.title] = [];
                }
                rawClippings[clipping.title].push(clipping);
            }
        });

        // Collapse multiple clippings into one if one of them has a note
        for (const bookTitle in rawClippings) {
            const clippings = rawClippings[bookTitle];
            let i = 1;
            while (i < clippings.length) {
                if (clippings[i].kind === 'note') {
                    clippings[i - 1].note = clippings[i].content;
                    clippings.splice(i, 1);
                } else {
                    i++;
                }
            }
        }

        return rawClippings;
    }



    return (
        <div className="container mx-auto p-4 h-[calc(100vh-2rem)]">

            {Object.keys(clippings).length === 0 ? (
                <>
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-3xl font-bold mb-4">MyClippings.txt <span className="text-sm font-normal">by <a href="https://twitter.com/feregri_no" target="_blank" rel="noopener noreferrer">@feregri_no</a></span></h1>
                    </div>
                    <div
                        {...getRootProps()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
                    >
                        <input {...getInputProps()} />
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-xl font-semibold">Drag & drop a MyClippings.txt file here, or click to select one</p>
                    </div>
                </>
            ) : (
                <QuotesView clippings={clippings} onReset={resetClippings} />
            )}
        </div>
    );
}

export default App;
