import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import AnimationWrapper from "../libs/page-animation";
import NotificationCard from "../components/NotificationCard";
import Nodata from "../components/Nodata";
import LoadMore from "../components/LoadMore";
import { PaginationStats } from "./Home";

export interface Notification {
    blogPost: {
        slug: string,
        title: string,
        _id: string,
        author: string
    },
    replied_on_comment?: {
        comment: string,
        _id: string
    },
    comment: {
        comment:string,
        _id:string
    },
    createdAt: string,
    seen: boolean,
    type: string,
    user: {
        personal_info:{
            fullname:string,
            profile_img:string,
            username: string,
        },
        _id: string
    },
    _id:string
}


const Notifications = () => {
    const [filter, setFilter] = useState('all');
    const [prevFilter, setPrevFilter] = useState('all');
    const [notifications, setNotifications] = useState<null | Notification[]>(null);
    const [notificationStats, setNotificationStats] = useState<PaginationStats>({
        currentPage: 1, 
        totalCount: 0, 
        totalPages:1        
    })
    let filters = ['all', 'like', 'comment', 'reply'];
    let notificationIds: string[];

    const getNotificationIds = (notifications: Notification[]) => {
        return notifications.map(notification => notification._id);
    }
    

    const notificationsSeen = async () => {
        try {
            if(notifications)
            notificationIds = getNotificationIds(notifications);
            const res = await fetch(`/api/notification/notifications-seen`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notifications: notificationIds })
            });
            const data = await res.json();
            toast.success(data.message)
        } catch (error) {
            console.log(error);
        }
    }
  
    const fetchNotifications = async (page: number = 1) => {
        try {
            
            // Submit the form data
            const res = await fetch(`/api/notification/get-notifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ page, filter })
            });
    
            const { data, currentPage, totalCount, totalPages } = await res.json();
    
            if (filter === prevFilter) {
                if(notifications && notifications.length > 0){
                     // Append fetched data to existing notifications
                    setNotifications([...notifications, ...data]);
                }else{
                    setNotifications(data);
                }               
            } else {
                // Set the fetched data directly
                setNotifications(data);
            }
            setNotificationStats({ currentPage, totalCount, totalPages })
            setPrevFilter(filter); // Update prevFilter
            // setFetchNeeded(false); // Reset fetchNeeded after fetching
        } catch (error: any) {
            console.log(error);
            toast.error(error.message);
        }
    }
    

    const handleFilter = (e:any) => {
        const btn = e.target;        
        setFilter(btn.textContent);
        setNotifications(null);
        setNotificationStats({currentPage: 1,totalCount: 0,totalPages:1});
        // setFetchNeeded(true); // Trigger fetch after filter change
        // fetchNotifications()
    }

    const handleDelete = async (index: number, notificationId: string) => {       
        try {
            const res = await fetch(`/api/notification/delete-notification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId })              
            });
            
            const { message, success } = await res.json(); 
            if (success) {
                toast.success(message);
                if (notifications) {
                    // Create a new array without the deleted notification
                    const updatedNotifications = [...notifications];
                    updatedNotifications.splice(index, 1);
                    setNotifications(updatedNotifications); // Update the state with the new array
                }
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.log(error);
        }
    }
    

    useEffect(() => {
        fetchNotifications();        
    }, [filter]);

    useEffect(() => {
        if(notifications)
        notificationsSeen()
    }, [notifications])

    useEffect(() => {    
        window.scrollTo(0, 0); 
    }, [filter]);

    // console.log('notifications ====>>', notifications)

  return (
    <div>
        <h1 className="max-md:hidden">Recent Notifications</h1>        
            <div className="my-4 flex gap-2 px-1 lg:gap-6 lg:px-2 py-4 sticky bg-white shadow-sm top-[78px]">
                {
                    filters.map((filterName, index) => {
                        return (
                            <button 
                                key={index}
                                onClick={handleFilter}
                                className={`py-1 max-md:px-5 md:py-2 ${filter === filterName ? 'btn-dark' : 'btn-light'}`}
                            >
                                {filterName}
                            </button>
                        )
                    })
                }
            </div>             
        <div className="flex flex-col gap-2 pb-4">
            {
                notifications === null ? (
                    <Loader />
                ) : notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <AnimationWrapper key={index} transition={{ delay: index * 0.08 }}>
                            <NotificationCard
                                data={notification}
                                index={index}
                                // notificationState={{notifications, setNotifications}}
                                handleDelete={handleDelete}
                            />
                        </AnimationWrapper>
                    ))
                ) : (
                    <Nodata message="No notifications found."/>
                )
            }
        </div>
        <LoadMore 
            state={notificationStats} 
            fetchDataFunction={fetchNotifications}
        />
    </div>
  )
}

export default Notifications