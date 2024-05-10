import { PaginationStats } from "../pages/Home"

const LoadMore = ({
    state,
    draft,
    activeFilter,
    fetchDataFunction,
    fetchCommentsFunction,
    fetchBlogsDraft,
    fetchUsers,
    blogId,
} : {
    state: PaginationStats,
    draft?:boolean,
    blogId?: string,
    activeFilter?:string,
    fetchBlogsDraft?: (page:number, draft:boolean) => void,  
    fetchUsers?: (page:number, activeFilter:string) => void,  
    fetchCommentsFunction?: (_id:string, page:number) => void,  
    fetchDataFunction?: (page:number) => void    
}) => {
    let {currentPage, totalPages } = state;   
    
    let nextPage = currentPage + 1;    

    // console.log('state  ======>>', state);
    // console.log('nextPage  ======>>', nextPage);

    const fetchData = () => {
        if(draft && fetchBlogsDraft){
            fetchBlogsDraft(nextPage, draft)
        }else if(fetchCommentsFunction && blogId){
            fetchCommentsFunction(blogId, nextPage)
        }else if(fetchUsers && activeFilter){
            fetchUsers(nextPage, activeFilter)
        }
        else if(fetchDataFunction){
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