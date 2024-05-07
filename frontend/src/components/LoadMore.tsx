import { PaginationStats } from "../pages/Home"

const LoadMore = ({
    state,
    draft,
    fetchDataFunction,
    fetchBlogsDraft,
} : {
    state: PaginationStats,
    draft?:boolean,
    fetchBlogsDraft?: (page:number, draft:boolean) => void,  
    fetchDataFunction?: (page:number) => void    
}) => {
    let {currentPage, totalPages } = state
    
    let nextPage = currentPage + 1;    

    const fetchData = () => {
        if(draft && fetchBlogsDraft){
            fetchBlogsDraft(nextPage, draft)
        }else if(fetchDataFunction){
            fetchDataFunction(nextPage)
        }
        
    }

    if(currentPage < totalPages){
        return (
            <button
                onClick={fetchData} 
                className='text-dark-grey rounded-md p-2 px-3 flex hover:bg-grey/30 items-center gap-2'>
                LoadMore
            </button>
          )
    }
 
}

export default LoadMore