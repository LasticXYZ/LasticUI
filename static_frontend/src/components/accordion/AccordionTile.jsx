import {useState, useRef} from "react";
import ArrowIcon from "../icon/ArrowIcon";

const AccordionTile = ({ question, answer }) => {

    const [isShowed, setIsShowed] = useState(false)
    const [height, setHeight] = useState('0px')

    const divHeight = useRef()

    const showAccordion = () => {

        setIsShowed((isShowed) => !isShowed);
        setHeight(isShowed ? "0px" : `${divHeight.current.scrollHeight}px`)

    }

        return (
            <div className="border-b">
                <div className="flex items-center justify-between w-full py-5 font-medium text-left " onClick={() => showAccordion() }>
                    <p className={ "transition-all duration-100 ease-in " + ( isShowed ? "font-bold dark-blue ": "font-medium")}>
                        {question}
                    </p>
                    <div className={"relative  mr-2" }>
                     <ArrowIcon open={isShowed} />

                    </div>
                </div>
                <div ref={divHeight} 
                
                style={{maxHeight : `${height}`}}
                className={"border-bottom overflow-hidden transform transition-max-height duration-500 ease-in-out" }>
                    <p className="mt-0 mr-6 py-3">
                        {answer}
                    </p>
                </div>

            </div>
        )

}


export default AccordionTile;