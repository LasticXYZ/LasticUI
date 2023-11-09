import { FC } from "react";

type TagCompProps = {
    title: string;
    className?: string;
};

const TagComp: FC<TagCompProps> = ({ title, className }) => (
    <div className={`${className} flex text-sm  justify-center cursor-pointer rounded-lg bg-gray-4 hover:bg-gray-18 align-middle px-2 py-2`}>
        { title }
    </div>
)

export default TagComp;
