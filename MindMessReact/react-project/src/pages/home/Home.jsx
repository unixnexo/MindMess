
function Home() {
    return (  
        <div className="p-5">
            <div className="grid grid-cols-4 gap-5">
                <div className="bg-gray-200 shadow-lg rounded-lg">1</div>
                <div className="grid grid-cols-4 *:h-[200px] gap-5 bg-white shadow-lg col-span-3">
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                    <div>5</div>
                    <div>6</div>
                    <div>7</div>
                    <div>8</div>
                </div>
            </div>
        </div>
    );
}

export default Home;