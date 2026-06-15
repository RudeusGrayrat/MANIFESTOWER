const PDetail = ({ content, value, tamaño }) => {
    return (
        <div className="flex flex-wrap">
            <p className={`${tamaño ? tamaño : "text-md"}  text-gray-900 my-0`}>
                <span className="text-sky-600 mr-2">{content?.toUpperCase() || content}</span>
                {value}
            </p>
        </div>
    );
};

export default PDetail