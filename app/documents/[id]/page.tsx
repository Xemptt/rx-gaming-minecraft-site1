"use client";

import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import { useParams } from "next/navigation";
import Link from "next/link";
import { documents } from "@/lib/documents";

export default function DocumentsDynamicPage() {
    const params = useParams();
    const id = params.id ? parseInt(params.id as string) : null;
    
    const currentDoc = documents.find(d => d.id === id);

    return (
        <div className="min-h-screen flex flex-col font-pixel bg-[#FAFAFA] text-black antialiased">
            <Navbar />

            <main className="max-w-7xl mx-auto w-full px-4 py-12 flex-grow">
                <div className="bg-[#4E9EFF] border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-10 mb-12 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-20">
                        <span className="text-white text-[100px] md:text-[180px] font-black tracking-tighter uppercase">
                            DOCUMENTS
                        </span>
                    </div>

                    <div className="relative z-10 text-center md:text-left">
                        <h1 className="text-5xl md:text-7xl font-black uppercase text-white [text-shadow:4px_4px_0px_#000] tracking-wider mb-2">
                            DOCUMENTS
                        </h1>
                        <p className="text-black text-xl font-bold uppercase tracking-widest">
                            LEGAL DOCUMENTS & POLICIES
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <aside className="lg:col-span-4 space-y-4">
                        <h3 className="text-2xl font-black uppercase border-l-8 border-black pl-4 mb-6">Document list</h3>
                        <div className="flex flex-col gap-4">
                            {documents.map((doc) => (
                                <Link
                                    key={doc.id}
                                    href={`/documents/${doc.id}`}
                                    className={`flex items-center gap-4 p-5 border-4 border-black font-black uppercase tracking-wide transition-all text-left shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none ${id === doc.id
                                            ? "bg-[#FFCC00] translate-x-1"
                                            : "bg-white hover:bg-gray-100"
                                        }`}
                                >
                                    <span className="text-3xl">{doc.icon}</span>
                                    <span>{doc.title}</span>
                                </Link>
                            ))}
                        </div>
                    </aside>

                    <section className="lg:col-span-8">
                        <div className="bg-black border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] min-h-[600px] h-full flex flex-col">
                            {currentDoc ? (
                                <iframe
                                    src={`${currentDoc.file}#toolbar=0`}
                                    className="w-full h-[700px] md:h-full flex-grow border-none"
                                    title="PDF Viewer"
                                />
                            ) : (
                                <div className="flex-grow flex flex-col items-center justify-center text-white p-10 text-center">
                                    <p className="font-black uppercase tracking-widest">Please select a document from the sidebar to display it</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
