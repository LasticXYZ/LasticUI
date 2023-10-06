const Background = ({
     children 
    } : {
        children: React.ReactNode
    }) => {
    return (
    <div className="bg-white  overflow-hidden">
        <div className="absolute z-0 inset-10 top-0 h-[40rem] overflow-hidden">
            <div className=" h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-6 to-white rounded-full transform -translate-y-1/2">
            </div>
        </div>
        <div className="absolute z-0 inset-x-0 top-0 h-[40rem] overflow-hidden">
            <div className=" h-full w-full bg-white opacity-90 transform ">
            </div>
        </div>

        <div className="relative z-10">
            { children }
        </div>
    </div>
    )
}

export default Background;