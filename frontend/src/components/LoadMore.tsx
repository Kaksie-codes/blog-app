import { BlogPageStats } from "../pages/Home"

const LoadMore = ({
    state,
    fetchDataFunction
} : {
    state: BlogPageStats,
    fetchDataFunction: (page:number) => void
}) => {
    let {currentPage, totalPages } = state
    
    let nextPage = currentPage + 1;    

    if(currentPage < totalPages){
        return (
            <button
                onClick={() => fetchDataFunction(nextPage)} 
                className='text-dark-grey rounded-md p-2 px-3 flex hover:bg-grey/30 items-center gap-2'>
                LoadMore
            </button>
          )
    }
 
}

export default LoadMore