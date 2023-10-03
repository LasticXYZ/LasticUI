
function SearchInput() {
  return (
    <form className="flex items-center">   
        <label htmlFor="simple-search" className="sr-only">Search</label>
        <div className="relative w-full rounded-full text-gray">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" className="w-5 h-5 text-gray-7 mx-4 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
            </div>
            <input type="text" id="simple-search" className="bg-gray-24 px-4 mx-4 font-rubik rounded-full border border-gray-20 text-gray-3 text-l  focus:border-gray-15 block w-full pl-10 p-2.5 " 
            placeholder="Search pools" required />
        </div>
    </form>

  );
}

export default SearchInput;
