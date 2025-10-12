import { useEffect } from "react"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import "aos/dist/aos.css"
import AOS from "aos"


import { Brain, FileText, Sparkles, Download } from "lucide-react"
import { Link } from "react-router"

export default function HomeSection() {
    useEffect(() => {
        AOS.init({ duration: 800, once: true })
    }, [])

    const features = [
        {
            title: "Create Notes",
            desc: "Write and organize your thoughts with our intuitive note editor. Support for markdown and rich formatting.",
            icon: <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />,
            bg: "bg-green-100 dark:bg-green-900",
        },
        {
            title: "AI Summarize",
            desc: "Let AI help you summarize long notes and suggest better titles for improved organization.",
            icon: <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
            bg: "bg-purple-100 dark:bg-purple-900",
        },
        {
            title: "Export",
            desc: "Export your notes as PDF or Markdown files. Share and backup your knowledge effortlessly.",
            icon: <Download className="h-8 w-8 text-orange-600 dark:text-orange-400" />,
            bg: "bg-orange-100 dark:bg-orange-900",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-16 text-center">
                {/* Hero Section */}
                <div className="mb-16" data-aos="fade-up">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-blue-600 rounded-full">
                            <Brain className="h-12 w-12 text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">AI-Powered Notes</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Transform your note-taking experience with intelligent features. Create, organize, and enhance your notes
                        with AI assistance.
                    </p>
                    <Link to="/dashboard">
                        <Button
                            label="Get Started"
                            size="large"
                            className="px-8 py-3 text-lg font-semibold rounded-full 
             bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 
             text-white shadow-lg hover:shadow-xl transition 
             transform hover:scale-105"
                        />
                    </Link>

                </div>

                {/* Features Section */}
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {features.map((f, i) => (
                        <Card
                            key={i}
                            data-aos="zoom-in"
                            data-aos-delay={i * 150}
                            className="text-center transition-all duration-300 
                 bg-white rounded-2xl dark:bg-gray-800 
                 hover:scale-105
                 hover:shadow-xl"
                        >
                            <div className="flex flex-col items-center p-6">
                                <div className={`mb-4 p-4 rounded-full w-fit ${f.bg}`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-xl text-white font-semibold mb-2">{f.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
                            </div>
                        </Card>
                    ))}
                </div>

            </div>
        </div>
    )
}
