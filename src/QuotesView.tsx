import { ScrollArea } from './components/ui/scroll-area';
import { useState, useRef } from 'react';
import { Clipping } from './Clipping';
import { Card, CardContent } from './components/ui/card';
import { Quote, Book } from 'lucide-react';

function QuotesView({ clippings, onReset }: { clippings: { [key: string]: Clipping[] }, onReset: () => void }) {
    const [activeBook, setActiveBook] = useState<string | null>(null)
    const bookRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const scrollToBook = (title: string) => {
        setActiveBook(title)
        bookRefs.current[title]?.scrollIntoView({ behavior: "smooth" })
    };

    return (
        <div className="flex flex-col md:flex-row h-full">
            {/* Index Sidebar */}
            <div className="w-1/4 pr-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Your books</h2>
                    <button onClick={onReset} className="p-1 bg-red-500 text-white rounded text-xs">Reset Clippings</button>
                </div>
                <ScrollArea className="h-full">
                    <ul className="space-y-2">
                        {Object.keys(clippings).map((bookTitle) => (
                            <li
                                key={bookTitle}
                                className={`cursor-pointer hover:text-primary transition-colors ${activeBook === bookTitle ? "text-primary font-semibold" : ""
                                    }`}
                                onClick={() => scrollToBook(bookTitle)}
                            >
                                {bookTitle}
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            </div>
            {/* Quotes View */}
            <div className="w-3/4">
                <ScrollArea className="h-[calc(100vh-2rem)] pr-4">
                    <div className="space-y-8">
                        {Object.entries(clippings).map(([bookTitle, clippings]) => (
                            <div key={bookTitle} ref={el => bookRefs.current[bookTitle] = el}>
                                <h2 className="text-xl font-semibold mb-4 flex items-center  sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 z-10 py-2">
                                    <Book className="h-5 w-5 mr-2" />
                                    {bookTitle}
                                </h2>
                                <div className="space-y-4">
                                    {clippings.map((quote, index) => (
                                        <div key={index}>
                                            <Card key={index} className="bg-card">
                                                <CardContent className="pt-6">
                                                    <div className="flex items-start space-x-2 mb-2">
                                                        <Quote className="h-5 w-5 mt-1 flex-shrink-0" />
                                                        <p className="italic">{quote.content}</p>
                                                    </div>
                                                    {quote.note && <p className="text-sm text-muted-foreground text-right mt-2">Note:
                                                         {quote.note}</p> }
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}

export default QuotesView;