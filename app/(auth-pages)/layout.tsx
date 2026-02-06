import "../globals.css";
import { Space_Grotesk } from 'next/font/google'
import Watermark from "@/app/components/ui/watermark";

const grotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-grotesk',
})

export const metadata = {
    title: 'NeuroSync',
    description: 'NeuroSync - AI Interview Platform',
}



export default function RootLayout({ children, }: { children: React.ReactNode }) {
    return (
        <div className={`${grotesk.className} bg-[#FFFFFF] h-full w-full`}>
            {children}
            <Watermark />
        </div>
    )
}