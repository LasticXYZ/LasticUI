import Image from "next/image";

const Background = ({
     children 
    } : {
        children: React.ReactNode
    }) => {
    return (
    <div className="bg-white  overflow-hidden">
        <div className="absolute z-0 inset-0 top-0 overflow-hidden">
            <Image 
                src='/assets/Images/home-banner.png'
                alt='hero'
                layout="fill"
            />
        </div>

        <div className="relative z-10">
            { children }
        </div>
    </div>
    )
}

export default Background;