import { BlogApiResponse } from '../pages/Home'

const LoadMore = ({
    state,
    fetchDataFunction
} : {
    state: BlogApiResponse | null,
    fetchDataFunction: (page:number) => void
}) => {
    
    if(state != null && state.currentPage < state.totalPages){
        return (
            <button
                onClick={() => fetchDataFunction(state.currentPage + 1)} 
                className='text-dark-grey rounded-md p-2 px-3 flex hover:bg-grey/30 items-center gap-2'>
                LoadMore
            </button>
          )
    }
 
}

export default LoadMore