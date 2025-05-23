import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { BellRing,
	Briefcase,
	House,
	LogOut,
	MessageSquareMore,
	UserRound, 
	UsersRound } from "lucide-react";
import { Link } from 'react-router-dom';

const Navbar = () =>{
    const queryClient = useQueryClient();
    const authUser = queryClient.getQueryData(["authUser"]);

    const {data: notifications} = useQuery({
        queryKey: ["notifications"],
        queryFn: async()=> axiosInstance.get("/notifications"),
        enabled: !!authUser
    })

    const {data: connectionRequests} = useQuery({
        queryKey: ["connectionRequests"],
        queryFn: async()=> axiosInstance.get("/connections/requests"),
        enabled: !!authUser
    })


    const { mutate: logout } = useMutation({
		mutationFn: () => axiosInstance.post("/auth/logout"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const { data: unreadCount } = useQuery({
		queryKey: ["unreadMessageCount"],
		queryFn: async () => {
		  const res = await axiosInstance.get("/messages/unread/count");
		  return res.data.count;
		},
		enabled: !!authUser,
	  });
	  
	  const unreadMessageCount = unreadCount || 0;
	  
	   
	  

    const unreadNotificationCount = notifications?.data.filter((notif) => !notif.read).length;
	const unreadConnectionRequestsCount = connectionRequests?.data?.length;

    return (
        <nav className='bg-white shadow-md sticky top-0 z-10'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='flex justify-between items-center py-3'>
					<div className='flex items-center space-x-4'>
						<Link to='/'>
							<img className='h-10 rounded' src='/IACNetworkHubLogo.png' alt='IACNetworkHub' />
						</Link>
					</div>
					<div className='flex items-center gap-2 md:gap-6'>
						{authUser ? (
							<>
								<Link to={"/"} className='text-neutral flex flex-col items-center'>
									<House size={20} />
									<span className='text-xs hidden md:block'>Home</span>
								</Link>
								<Link to='/network' className='text-neutral flex flex-col items-center relative'>
									<UsersRound size={20} />
									<span className='text-xs hidden md:block'>My Network</span>
									{unreadConnectionRequestsCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-4 md:size-4 flex items-center justify-center'
										>
											{unreadConnectionRequestsCount}
										</span>
									)}
								</Link>
								<Link to='/messages' className='text-neutral flex flex-col items-center relative'>
									<MessageSquareMore size={20} />
									<span className='text-xs hidden md:block'>message</span>
									{unreadMessageCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-2 bg-blue-500 text-white text-xs 
										rounded-full size-4 md:size-4 flex items-center justify-center'
										>
											{unreadMessageCount}
										</span>
									)}
								</Link>
								<Link to={"/jobs"} className='text-neutral flex flex-col items-center'>
									<Briefcase size={20} />
									<span className='text-xs hidden md:block'>Jobs</span>
								</Link>
								<Link to='/notifications' className='text-neutral flex flex-col items-center relative'>
									<BellRing size={20} />
									<span className='text-xs hidden md:block'>Notifications</span>
									{unreadNotificationCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-4 md:size-4 flex items-center justify-center'
										>
											{unreadNotificationCount}
										</span>
									)}
								</Link>
								<Link
									to={`/profile/${authUser.username}`}
									className='text-neutral flex flex-col items-center'
								>
									<UserRound size={20} />
									<span className='text-xs hidden md:block'>Me</span>
								</Link>
								<button
									className='flex items-center cursor-pointer space-x-1 text-sm text-gray-600 hover:text-gray-800'
									onClick={() => logout()}
								>
									<LogOut size={20} />
									<span className='hidden md:inline'>Logout</span>
								</button>
							</>
						) : (
							<>
								<Link to='/login' className='btn btn-ghost text-black hover:text-white'>
									Sign In
								</Link>
								<Link to='/signup' className='btn btn-primary'>
									Join now
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
    )
};

export default Navbar;